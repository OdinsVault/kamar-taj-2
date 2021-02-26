const user = require("../models/user");
const User = require("../models/user");

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

// search the leaderboard for user
exports.searchLeaderboard = async (req, res) => {
  if (!req.query.s) return res.status(400).json({status: 'Search query is not present'});

  try {
    const users = await User.aggregate([
      { $project: { password: 0, __v: 0 } },
      { $sort: { score: -1 } },
      { $group: { _id: '', ranked: { $push: '$$ROOT'} } },
      { $unwind: { path: '$ranked', includeArrayIndex: 'rank' } },
      { $match: 
        { $or: [
          { 'ranked.fname': req.query.s },
          { 'ranked.lname': req.query.s },
          { 'ranked.email': req.query.s },
        ] } },
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

    users.map(doc => doc.rank++);

    const response = {
      search: {query: req.query.s},
      results: users
    }

    res.status(200).json(response);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
}

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