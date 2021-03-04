const User = require('../models/user'),
      PracticeQ = require('../models/practiceQuestion'),
    //   CompeteQ = require('../models/competeQuestion'),
      {ROUTES} = require('../resources/constants');


exports.practiceAnswer = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});
  
    try {
        // check if user has already completed the question
        const user = await User.findById(req.userData.userId);
        if (!user) return res.status(404).json({status: 'User not found'});
        // If already answered, return without running tests or updating score
        if (user._doc.finished.practice.includes(id)) return res.status(200).json({message: 'Question already answered'});

        // Get the question 
        const answeredQ = await PracticeQ.findById(id);
        if (!answeredQ) return res.status(404).json({status: 'Question not found'});

        // get the test cases to test with the provided answer
        const testCases = answeredQ._doc.testcases;

        // run the tests & collect the console output to response object
        const output = {
            answer: req.body.answer,
            testCases,
            passed: true,
        };

        const response = {
            message: 'Practice question answer failed',
            consoleResult: output,
            updatedUser: null,
        }

        // if not all tests are passed, do not update the user score
        if (!output.passed) return res.status(200).json(output);

        // update the user score only the user got the answer correct
        // Increment the score only if question is not answered previously
        const updatedUser = await User
            .findOneAndUpdate(
                {_id: req.userData.userId},
                {
                    $inc: {score: answeredQ._doc.pointsAllocated}, // increment the score by question points
                    $addToSet: {'finished.practice': answeredQ}, // add the question to the completed list
                },
                {new: true});

        if (!updatedUser) return res.status(404).json({status: 'User not found'});

        // delete unnecessary fields from updated response
        delete updatedUser._doc.__v;
        delete updatedUser._doc.password;
        delete updatedUser._doc.dob;
    
        // update the response obj for passed answer
        response.message = 'Practice question answer passed';
        response.updatedUser = updatedUser;
    
        res.status(200).json(response);
  
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

// exports.competeAnswer = async (req, res) => {
    
// }