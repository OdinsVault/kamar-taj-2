const User = require("../models/user"),
      mongoose = require('mongoose');

// get the leaderboard rankings
exports.rankings = async (req, res) => {
  const page = (req.query.page)? Number(req.query.page) : 0,
        limit = (req.query.limit)? Number(req.query.limit) : 10;
    try {
        const userList = await User.aggregate([
          { $project: { password: 0, __v: 0 } },
          { $sort: { score: -1 } },
          { $group: { _id: '', ranked: { $push: '$$ROOT'}, total: { $sum: 1 } } },
          { $unwind: { path: '$ranked', includeArrayIndex: 'rank' } },
          { $skip: page * limit },
          { $limit: limit },
          { $project: 
              { 
                  _id: '$ranked._id',
                  fname: '$ranked.fname',
                  lname: '$ranked.lname',
                  score: '$ranked.score',
                  email: '$ranked.email',
                  rank: 1,
                  total: 1,
                  completion: '$ranked.completion',
                  institute: '$ranked.institute'
              } },
        ]);

        if (!userList) return res.status(404).json({status: 'Rankings could not be retreived'});

        const total = userList[0].total;
        userList.map(doc => {
          doc.rank++;
          delete doc.total;
        });

        const response = {
          pageInfo: { total, page, limit },
          results: userList
        }

        return res.status(200).json(response);
      } catch (err) {
        console.log(err);
          res.status(500).json({
            error: err,
          });
      }
}

// search the leaderboard for user & get ranking details
exports.getUserRanking = async (req, res) => {
  if (!req.params.userId) return res.status(400).json({status: 'UserId is not present'});

  try {
    const user = await User.aggregate([
      { $project: { password: 0, __v: 0 } },
      { $sort: { score: -1 } },
      { $group: { _id: '', ranked: { $push: '$$ROOT'} } },
      { $unwind: { path: '$ranked', includeArrayIndex: 'rank' } },
      { $match: { 'ranked._id': mongoose.Types.ObjectId(req.params.userId) } },
      { $project: 
          { 
              _id: '$ranked._id',
              fname: '$ranked.fname',
              lname: '$ranked.lname',
              score: '$ranked.score',
              email: '$ranked.email',
              rank: 1,
              completion: '$ranked.completion',
              institute: '$ranked.institute'
          } },
    ]);

    user[0].rank++;

    res.status(200).json(user[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
}

// filter the leaderboard on score and/or institute
exports.filterLeaderboard = async (req, res) => {

  const match = { $match: {
    $and: [] 
  } };

  if (req.query.i) {
    match.$match.$and.push({ 'ranked.institute': req.query.i });
  }
  if (req.query.s) {
    match.$match.$and.push({ 'ranked.score': Number(req.query.s) });
  }
  if (!req.query.i && !req.query.s) delete match.$match.$and;

  try {
    const usersList = await User.aggregate([
      { $project: { password: 0, __v: 0 } },
      { $sort: { score: -1 } },
      { $group: { _id: '', ranked: { $push: '$$ROOT'} } },
      { $unwind: { path: '$ranked', includeArrayIndex: 'rank' } },
      match,
      { $project: 
          { 
              _id: '$ranked._id',
              fname: '$ranked.fname',
              lname: '$ranked.lname',
              score: '$ranked.score',
              email: '$ranked.email',
              rank: 1,
              completion: '$ranked.completion',
              institute: '$ranked.institute'
          } },
    ]);

    usersList.map(doc => doc.rank++);

    const response = {
      filter: {score: req.query.s, institute: req.query.i},
      results: usersList
    }

    res.status(200).json(response);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
}

// get the distinct values for institute for filtration
exports.distinctInstitutes = async (req, res) => {
  try {
    const distincts = await User.distinct("institute");

    res.status(200).json(distincts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
}