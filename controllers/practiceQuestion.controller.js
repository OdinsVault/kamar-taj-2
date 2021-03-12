const PracticeQ = require("../models/practiceQuestion"),
      { ROUTES } = require("../resources/constants");

//Get all questions
exports.get_all = (req, res) => {
  PracticeQ.find()
    .select('-__v')
    .sort('level')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        questions: docs.map((doc) => {
          return {
            ...doc._doc,
            request: {
              type: "GET",
              url: `${process.env.BASE_URL}/${ROUTES.PRACTICEQ}/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//get question by level
exports.get_by_level = (req, res) => {
  PracticeQ.aggregate([
    { $unset: '__v' },
    { $group: { _id: "$level", questions: { $push: "$$ROOT" } } },
    { $sort: { _id: 1 } },
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
      res.status(200).json(response);
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


