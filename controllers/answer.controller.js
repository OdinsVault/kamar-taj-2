const User = require('../models/user'),
      PracticeQ = require('../models/practiceQuestion'),
    //   CompeteQ = require('../models/competeQuestion'),
      {ROUTES} = require('../resources/constants');


exports.practiceAnswer = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') 
        return res.status(400).json({message: 'Question id is not present'});
  
    try {
        // check if user has already completed the question
        const user = await User.findById(req.userData.userId);
        if (!user) return res.status(404).json({status: 'User not found'});
        // If already answered, return without running tests or updating score
        if (user._doc.finished.practice.includes(id)) 
            return res.status(200).json({message: 'Question already answered'});

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
            levelInfo: {
                leveledUp: false,
                completion: 0,
            },
        }

        // if not all tests are passed, do not update the user score
        if (!output.passed) return res.status(200).json(output);

        // update the user score only the user got the answer correct
        // Increment the score only if question is not answered previously
        let updatedUser = await User
            .findOneAndUpdate(
                {_id: req.userData.userId},
                {
                    $inc: {score: answeredQ._doc.pointsAllocated}, // increment the score by question points
                    $addToSet: {'finished.practice': answeredQ}, // add the question to the completed list
                },
                {new: true}).select('-__v -dob -password');

        if (!updatedUser) return res.status(404).json({status: 'User not found'});

        // check & update the user level
        // get the questionIds grouped by level
        const questionByLevels =  await PracticeQ.aggregate([
            { $project: { level: 1, _id: 1 } },
            { $sort: { level: -1 } },
            { $group: { _id: "$level", questions: { $push: "$$ROOT._id" } } },
          ]);

        // if all completed for current level, increment the level & add level completion badge
        const levelCompleted = questionByLevels[updatedUser._doc.completion - 1].questions
                            .every(id => updatedUser._doc.finished.practice.includes(id));

        if (levelCompleted) {
            // increment user completion 
            // TODO: add the badge
            updatedUser = await User
                .findOneAndUpdate(
                    {_id: req.userData.userId},
                    {
                        $inc: { completion: 1 },
                    },
                    {new: true}).select('-__v -dob -password');
            // set the response object level props
            response.levelInfo.leveledUp = true;
        }
        response.levelInfo.completion = updatedUser._doc.completion;
    
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