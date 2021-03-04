
const CompeteQ = require('../models/competeQuestion'),
      { ROUTES } = require('../resources/constants');

/**
 * Get all compete questions
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getAll = async (req, res) => {
    try {
        const questions = await CompeteQ.find().select('-__v');

        const response = {
            count: questions.length,
            questions: questions.map(q => {
                return {
                    ...q._doc,
                    request: {
                        type: 'GET',
                        url: `${process.env.BASE_URL}/competequestion/${q._id}`
                    }
                }
            }),
        };

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

/**
 * Get compete questions grouped by category
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getByCategory = async (req, res) => {
    try {
        const questions = await CompeteQ.aggregate([
            { $project: { __v: 0 } },
            { $group: { _id: '$category', questions: { $push: '$$ROOT' } } }
        ]);

        const response = {
            categoryCount: questions.length,
            categories: questions.map(q => {
                return {
                    category: q._id,
                    questions: q.questions
                }
            })
        };

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

/**
 * Get question by question Id
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getOne = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id not present'});

    try {
        const question = await CompeteQ.findById(id).select('-__v');

        if (!question) return res.status(404).json({ message: "No valid entry found for provided ID" });

        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

/**
 * Create compete question
 * @param {Request} req 
 * @param {Response} res 
 */
exports.createCompeteQuestion = async (req, res) => {
    const mongoose = require('mongoose');

    const question = new CompeteQ({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        inputs: req.body.inputs,
        outputs: req.body.outputs,
        difficulty: req.body.difficulty,
        category: req.body.category,
        testcases: req.body.testcases,
        pointsAllocated: req.body.pointsAllocated,
      });

      try {
        const saved = await question.save();
        
        res.status(201).json({
            message: "CompeteQ saved successfully!",
            created: saved,
            request: {
              type: "GET",
              url: process.env.BASE_URL + "/competequestion/" + result._id,
            },
          });
        
      } catch (err) {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      }

}
