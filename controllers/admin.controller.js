const PracticeQ = require("../models/practiceQuestion"),
      CompeteQ = require("../models/competeQuestion"),
      mongoose = require("mongoose"),
      { ROUTES } = require("../resources/constants");

// Practice Question admin handlers
exports.createPracticeQ = async (req, res) => {
    try {
        const question = new PracticeQ({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description,
            inputs: req.body.inputs,
            outputs: req.body.outputs,
            difficulty: req.body.difficulty,
            level: req.body.level,
            category: req.body.category,
            testcases: req.body.testcases,
            pointsAllocated: req.body.pointsAllocated,
          });

        const saved = await question.save();

        const response = {
                message: "Practice question saved successfully!",
                created: saved._doc,
                request: {
                type: 'GET',
                url: `${process.env.BASE_URL}/${ROUTES.PRACTICEQ}/${saved._id}`,
            },
        }

        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err});
    }
}

exports.updatePracticeQ = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

    try {
        const updatedQ = await PracticeQ
        .findOneAndUpdate({_id: id}, req.body, {new: true}).select('-__v');

        if (!updatedQ) return res.status(404).json({status: 'Question not found'});

        const response = {
        message: 'Practice question updated!',
        updated: updatedQ,
        request: {
            type: 'GET',
            url: `${process.env.BASE_URL}/${ROUTES.PRACTICEQ}/${id}`,
        },
        }

        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

exports.deletePracticeQ = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

    try {
        await PracticeQ.deleteOne({_id: id});
        
        res.status(200).json({
            message: 'Practice question deleted!',
            request: {
                type: 'POST',
                description: 'You can create a question with this URL',
                url: `${process.env.BASE_URL}/${ROUTES.PRACTICEQ}`,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

// ------------------------------
// Compete Question admin handlers
exports.createCompeteQ = async (req, res) => {

      try {
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

        const saved = await question.save();
        
        res.status(201).json({
            message: 'Compete question saved successfully!',
            created: saved,
            request: {
              type: 'GET',
              url: `${process.env.BASE_URL}/${ROUTES.COMPETEQ}/${saved._id}`,
            },
          });
        
      } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
      }
}

exports.updateCompeteQ = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

    try {
        const updatedQ = await CompeteQ
            .findOneAndUpdate({_id: id}, req.body, {new: true}).select('-__v');

        if (!updatedQ) return res.status(404).json({status: 'Question not found'});

        const response = {
        message: 'Compete question updated!',
        updated: updatedQ,
        request: {
            type: 'GET',
            url: `${process.env.BASE_URL}/${ROUTES.PRACTICEQ}/${id}`,
        },
        }

        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

exports.deleteCompeteQ = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

    try {
        await CompeteQ.deleteOne({_id: id});
        
        res.status(200).json({
            message: 'Compete question deleted!',
            request: {
                type: 'POST',
                description: 'You can create a question with this URL',
                url: `${process.env.BASE_URL}/${ROUTES.COMPETEQ}`,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

