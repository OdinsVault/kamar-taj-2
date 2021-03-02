const PracticeQ = require("../models/practiceQuestion");
const mongoose = require("mongoose");

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
exports.get_one = (req, res, next) => {
  const id = req.params.questionId;
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
exports.create_question = (req, res, next) => {
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
exports.update_question = (req, res, next) => {
  const id = req.params.questionId;
  if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

  PracticeQ.update({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Question updated!",
        request: {
          type: "GET",
          url: process.env.BASE_URL + "/questions/" + id,
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

//Delete question

exports.delete_question = (req, res, next) => {
  const id = req.params.questionId;
  PracticeQ.deleteOne({ _id: id })
    .exec()
    .then((result) => {
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
