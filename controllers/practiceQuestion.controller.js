const PracticeQ = require("../models/practiceQuestion");
const mongoose = require("mongoose");
const { ROUTES } = require("../resources/constants");

//Get all questions
exports.get_all = (req, res, next) => {
  PracticeQ.find()
    .select("_id title description inputs outputs difficulty level category")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        questions: docs.map((doc) => {
          return {
            id: doc._id,
            title: doc.title,
            description: doc.description,
            difficulty: doc.difficulty,
            level: doc.level,
            request: {
              type: "GET",
              url: process.env.BASE_URL + "/questions/" + doc._id,
            },
          };
        }),
      };
      res.status(201).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//get question by level
exports.get_by_level = (req, res, next) => {
  PracticeQ.aggregate([
    { $group: { _id: "$level", questions: { $push: "$$ROOT" } } },
  ])
    .exec()
    .then((docs) => {
      const response = {
        levelCount: docs.length,
        levels: docs.map((doc) => {
          return {
            level: doc._id,
            questions: doc.questions,
          };
        }),
      };
      res.status(201).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//Get question by id
exports.get_one = (req, res) => {
  const id = req.params[ROUTES.QUESTIONID];
  PracticeQ.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//Create question
exports.create_question = (req, res) => {
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

  question
    .save()
    .then((result) => {
      res.status(201).json({
        message: "PracticeQ saved successfully!",
        created: result,
        request: {
          type: "GET",
          url: process.env.BASE_URL + "/questions/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//Update question
exports.update_question = async (req, res) => {
  const id = req.params[ROUTES.QUESTIONID];
  if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

  try {
    const updatedQ = await PracticeQ
      .findOneAndUpdate({_id: id}, req.body, {new: true});

    if (!updatedQ) return res.status(404).json({status: 'Question not found'});

    const response = {
      message: 'Question updated!',
      updated: updatedQ,
      request: {
        type: 'GET',
        url: `${process.env.BASE_URL}/questions/${id}`,
      },
    }

    res.status(200).json(response);

  } catch (err) {
    console.log(err);
    res.status(500).json({error: err});
  }
};

//Delete question

exports.delete_question = (req, res) => {
  const id = req.params[ROUTES.QUESTIONID];
  PracticeQ.deleteOne({ _id: id })
    .exec()
    .then((_) => {
      res.status(200).json({
        message: "Question deleted!",
        request: {
          type: "POST",
          description: "You can create a question with this URL",
          url: process.env.BASE_URL + "/questions/",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
