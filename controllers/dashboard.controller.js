const User = require("../models/user");

exports.rankings = async (req, res) => {
    try {
        const userList = await User.aggregate([
         { $project: { password: 0, __v: 0 } },
         { $sort: { score: 1 } },
         { $group: { _id: '', ranked: { $push: '$$ROOT'} } },
         { $unwind: { path: '$ranked', includeArrayIndex: 'rank' } },
         { $project: 
            { 
                _id: '$ranked._id',
                fname: '$ranked.fname',
                lname: '$ranked.lname',
                score: { $toInt: '$ranked.score' },
                rank: 1,
                completion: { $toInt: '$ranked.completion' }
            } }
        ]);
        if (!userList) return res.status(404).json({status: 'Rankings could not be retreived'});
    
        return res.status(200).json(userList);
      } catch (err) {
        console.log(err);
          res.status(500).json({
            error: err,
          });
      }
}