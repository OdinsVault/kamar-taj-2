const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExceptionHandler = require("../exceptions/ExceptionHandler");
const { ROUTES } = require("../resources/constants");

//Signup User
exports.signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "This email already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              fname: req.body.fname,
              lname: req.body.lname,
              email: req.body.email,
              institute: req.body.institute,
              dob: new Date(req.body.dob),
              password: hash,
            });
            user
              .save()
              .then((result) => {
                delete result._doc.password;
                delete result._doc.__v; // remove unnecessary fields from return obj
                return res.status(201).json({
                  message: "User created successfully!",
                  result
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//Login
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user === null) {
        return res.status(401).json({
          message: "Authentication failed!",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication failed!",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Authentication successful!",
            token: token,
          });
        }
        res.status(401).json({
          message: "Authentication failed!",
        });
      });
    })
    .catch(ExceptionHandler.handleError);
};

//Delete own User profile
exports.deleteUser = (req, res) => {
  User.remove({ _id: req.userData.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted!",
        status: result
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//Get all users
exports.getAllUsers = (req, reg, next) => {
  User.find()
    .select("_id fname lname email")
    .exec()
    .then((docs) => {
      const response = {
        userCount: docs.length,
        users: docs.map((doc) => {
          return {
            id: doc._id,
            fname: doc.fname,
            lname: doc.lname,
            email: doc.email,
          };
        }),
      };
    })
    .catch();
};

/**
 * get user personal profile - populated with completed questions
 * or get only the user profile.
 * 
 * Provide query parameter: `populate=true` to get full profile
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getUser = async (req, res) => {
  const isPopulate = Boolean(req.query.populate || false);

  let query = User.findOne({_id: req.userData.userId}, '-__v -password');

  try {
    let user;

    if (isPopulate) {
      user = await query.populate('finished.practice', '-__v').populate('finished.compete', '-__v');
    } else {
      user = await query;
    }

    if (!user) return res.status(404).json({status: 'User not found'});

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({status: 'Error occured', err});
  }
};

/**
 * Edit the logged in user personal details
 * @param {Request} req 
 * @param {Response} res 
 */
exports.editUser = async (req, res) => {
  if (!req.body) return res.status(400).json({status: 'No update body present'});
  // remove unnecessary fields from update
  delete req.body.finished;
  delete req.body.score;
  delete req.body.completion;

  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashed;

    const updatedUser = await User
      .findOneAndUpdate({ _id: req.userData.userId }, req.body, { new: true });

    if (!updatedUser) return res.status(404).json({status: 'User not found'});

    // delete unnecessary fields from updated response
    delete updatedUser.__v;
    delete updatedUser.password;

    res.status(200).json({message: 'User updated', updated: updatedUser});
  } catch (err) {
      console.log(err);
      res.status(500).json({status: 'Error occured', err});
  }
}

/**
 * search users on `fname||lname||email` 
 * autocomplete results limit 10
 * 
 * Provide the search string in query parameter: `search=<searchStr>`
 * @param {Request} req 
 * @param {Response} res 
 */
exports.autocompleteUser = async (req, res) => {
  if (!req.query.search) return res.status(400).json({status: 'Search query is not present'});

  try {
    const results = await User.aggregate([
      {
        $search: {
          index: 'users-search',
          compound: {
            should: [
              {
                autocomplete: {
                query: req.query.search,
                path: "fname",
                fuzzy: {
                    maxEdits: 2,
                    prefixLength: 3
                  }
                }
              },
              {
                autocomplete: {
                query: req.query.search,
                path: "lname",
                fuzzy: {
                    maxEdits: 2,
                    prefixLength: 3
                  }
                }
              },
              {
                autocomplete: {
                query: req.query.search,
                path: "email",
                fuzzy: {
                    maxEdits: 2,
                    prefixLength: 3
                  }
                }
              },
            ]
          }
        }
      },
      { $limit: 10 },
      { $project: { _id: 1, fname: 1, lname: 1, email: 1 } }
    ]);

    const response = {
      search: req.query.search,
      results
    }

    res.status(200).json(response);

  } catch (err) {
    console.log(err);
      res.status(500).json({
        error: err,
      });
  }
}

/**
 * Get performance details of the user
 * specified in path variable: /:userId
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getPeformance = async (req, res) => {
  if (!req.params[ROUTES.USERID]) return res.status(400).json({status: 'User id not presented'});

  try {
    const user = await User.aggregate([
      {$project: { _id: 1, score: 1, completion: 1 }},
      {$sort: { score: -1 }},
      {$group: { _id: '', ranked: { $push: '$$ROOT'} }},
      {$unwind: { path: '$ranked', includeArrayIndex: 'rank' }},
      { $project: {
          _id: '$ranked._id',
          score: '$ranked.score',
          completion: '$ranked.completion',
          rank: 1 } },
      {$match: { _id: mongoose.Types.ObjectId(req.params[ROUTES.USERID]) }},
    ]);

    if (!user) return res.status(404).json({status: 'User not found'});

    user.map(u => u.rank++);
    return res.status(200).json(user);

  } catch (err) {
    console.log(err);
      res.status(500).json({
        error: err,
      });
  }
};
