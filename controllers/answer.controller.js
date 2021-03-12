const User = require('../models/user'),
      PracticeQ = require('../models/practiceQuestion'),
      CompeteQ = require('../models/competeQuestion'),
      mongoose = require("mongoose"),
      exec = require('child_process').execSync,
      fs = require('fs'),
      {ROUTES} = require('../resources/constants');


exports.practiceAnswer = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') 
        return res.status(400).json({message: 'Question id is not present'});
  
    try {
        // check if user has already completed the question
        const user = await User.findById(req.userData.userId);
        if (!user) return res.status(404).json({message: 'User not found'});
        // If already answered & passed, return without running tests or updating score
        let questionAttempt = user._doc.attempts.practice
            .find(attempt => String(attempt._doc.question._id) === String(id));
        if (questionAttempt && questionAttempt.passed) 
            return res.status(200).json({message: 'Question already answered correctly'});

        // Get the question 
        const answeredQ = await PracticeQ.findById(id);
        if (!answeredQ) return res.status(404).json({message: 'Question not found'});

        // Check if user is authorized to answer the question - compare user level & question level
        if (user._doc.completion !== answeredQ._doc.level)
            return res.status(401).json({
                message: 'User\'s level is too low to answer this question',
                status: {
                    requiredLevel: answeredQ._doc.level,
                    userLevel: user._doc.level
                }
            });

        // get the test cases to test with the provided answer
        const testCases = answeredQ._doc.testcases;

        // run the tests & collect the console output to response object
        const output = {
            answer: req.body.answer,
            testCases,
            passed: false,
            compilerResult: {
                status: 0,
                stdout: '',
                stderr: '',
            },
        };

        // // -----------------------------------------
        // // TODO: Run the code here & get the results
        // try {
        //     fs.writeFileSync(`Code.java`, req.body.answer); // create temp file with code
        //     exec('javac Code.java', {encoding: 'utf-8'}); // compile
        //     const results = exec('java Code', {encoding: 'utf-8'}); // run
        //     output.compilerResult.stdout = results;
        // } catch (err) { // set the error values to output object
        //     output.compilerResult.status = err.status;
        //     output.compilerResult.stdout = err.stdout;
        //     output.compilerResult.stderr = err.stderr;
        // }
        // // set passed status by checking errors from code output
        // if (output.compilerResult.stderr === '')
        //     output.passed = true;
        // // -----------------------------------------

        const response = {
            message: output.passed? 'Practice question answer passed':'Practice question answer failed',
            consoleResult: output,
            updatedUser: null,
            levelInfo: {
                leveledUp: false,
                completion: 0,
            },
        }

        // if the question is previously attempted, increase the attempt count & update the passed status
        // if not attempted, add new attempt of this question with passed status

        let updateObj = {};
        if (output.passed) { // update the user score only if all tests are passed
            updateObj['$inc'] = { score: answeredQ._doc.pointsAllocated };
        }
        let userUpdateQuery;
        if (questionAttempt) { // already attempted - update the attempt props
            questionAttempt.passed = output.passed;
            questionAttempt.count++;

            updateObj['$set'] = {'attempts.practice.$[attempt]': questionAttempt};

            userUpdateQuery = User
                .findOneAndUpdate(
                    {_id: req.userData.userId},
                    updateObj,
                    {
                        arrayFilters: [ // filter the attempts array to find attempt of this question
                            {'attempt._id': mongoose.Types.ObjectId(questionAttempt._doc._id)},
                        ],
                        new: true, useFindAndModify: true
                    });
        } else { // add new attempt of this question
            questionAttempt = {
                question: id,
                passed: output.passed,
                count: 1
            };
            updateObj['$push'] = {'attempts.practice': questionAttempt}; // push the new attempt object
            userUpdateQuery = User
                .findOneAndUpdate(
                    {_id: req.userData.userId},
                    updateObj,
                    {new: true, useFindAndModify: true});
        }

        let updatedUser = await userUpdateQuery.select('-__v -dob -password'); // execute the user update

        if (!updatedUser) return res.status(404).json({message: 'User not found'});

        // check & update the user level
        // get the questionIds grouped by level
        const questionByLevels =  await PracticeQ.aggregate([
            { $project: { level: 1, _id: 1 } },
            { $group: { _id: "$level", questions: { $push: "$$ROOT._id" } } },
            { $sort: { _id: 1 } },
          ]);

        // if all passed for current level, increment the level & add level completion badge
        const questionsOfLevel = questionByLevels[updatedUser._doc.completion].questions;
        const levelCompleted = questionsOfLevel
                .every(qId => {
                    return updatedUser._doc.attempts.practice.find(attempt => {
                        return (String(qId) === String(attempt._doc.question._id)) && attempt._doc.passed === true;
                    });
                });

        if (levelCompleted) {
            // increment user completion 
            // TODO: add the badge
            updatedUser = await User
                .findOneAndUpdate(
                    {_id: req.userData.userId},
                    {
                        $inc: { completion: 1 },
                    },
                    {new: true, useFindAndModify: true}).select('-__v -dob -password');
            // set the response object level props
            response.levelInfo.leveledUp = true;
        }

        // update the response obj
        response.levelInfo.completion = updatedUser._doc.completion;
        response.updatedUser = updatedUser;
    
        res.status(200).json(response);
  
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred while processing answer for practice question',
            error: err
        });
    }
}

exports.competeAnswer = async (req, res) => {
    // proceeed only if the question id is present
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') 
        return res.status(400).json({message: 'Question id is not present'});

    try {
        // check if user has already completed the question
        const user = await User.findById(req.userData.userId);
        if (!user) return res.status(404).json({message: 'User not found'});
        // If already answered & passed, return without running tests or updating score
        let questionAttempt = user._doc.attempts.compete
            .find(attempt => String(attempt._doc.question._id) === String(id));

        if (questionAttempt && questionAttempt.passed) 
            return res.status(200).json({message: 'Question already answered correctly'});

        // Get the question 
        const answeredQ = await CompeteQ.findById(id);
        if (!answeredQ) return res.status(404).json({message: 'Question not found'});

        // get the test cases to test with the provided answer
        const testCases = answeredQ._doc.testcases;

        // run the tests & collect the console output to response object
        const output = {
            answer: req.body.answer,
            testCases,
            passed: false,
            compilerResult: {
                status: 0,
                stdout: '',
                stderr: '',
            },
        };

        // // -----------------------------------------
        // // TODO: Run the code here & get the results
        // try {
        //     fs.writeFileSync(`Code.java`, req.body.answer); // create temp file with code
        //     exec('javac Code.java', {encoding: 'utf-8'}); // compile
        //     const results = exec('java Code', {encoding: 'utf-8'}); // run
        //     output.compilerResult.stdout = results;
        // } catch (err) { // set the error values to output object
        //     output.compilerResult.status = err.status;
        //     output.compilerResult.stdout = err.stdout;
        //     output.compilerResult.stderr = err.stderr;
        // }
        // // set passed status by checking errors from code output
        // if (output.compilerResult.stderr === '')
        //     output.passed = true;
        // // -----------------------------------------

        const response = {
            message: output.passed? 'Compete question answer passed':'Compete question answer failed',
            consoleResult: output,
            updatedUser: null,
        }

        // if the question is previously attempted, increase the attempt count & update the passed status
        // if not attempted, add new attempt of this question with passed status

        let updateObj = {};
        if (output.passed) { // update the user score only if all tests are passed
            updateObj['$inc'] = { score: answeredQ._doc.pointsAllocated };
        }
        let userUpdateQuery;
        if (questionAttempt) { // already attempted - update the attempt props
            questionAttempt.passed = output.passed;
            questionAttempt.count++;

            updateObj['$set'] = {'attempts.compete.$[attempt]': questionAttempt};

            userUpdateQuery = User
                .findOneAndUpdate(
                    {_id: req.userData.userId},
                    updateObj,
                    {
                        arrayFilters: [ // filter the attempts array to find attempt of this question
                            {'attempt._id': mongoose.Types.ObjectId(questionAttempt._doc._id)},
                        ],
                        new: true, useFindAndModify: true
                    });
        } else { // add new attempt of this question
            questionAttempt = {
                question: id,
                passed: output.passed,
                count: 1
            };
            updateObj['$push'] = {'attempts.compete': questionAttempt}; // push the new attempt object
            userUpdateQuery = User
                .findOneAndUpdate(
                    {_id: req.userData.userId},
                    updateObj,
                    {new: true, useFindAndModify: true});
        }

        let updatedUser = await userUpdateQuery.select('-__v -dob -password'); // execute the user update

        if (!updatedUser) return res.status(404).json({message: 'User not found'});

        // update the response obj
        response.updatedUser = updatedUser;
    
        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred while processing answer for compete question',
            error: err
        });
    }
}