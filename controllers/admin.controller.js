const PracticeQ = require("../models/practiceQuestion"),
      CompeteQ = require("../models/competeQuestion"),
      User = require("../models/user"),
      Tutorial = require("../models/tutorial"),
      mongoose = require("mongoose"),
      jwt = require("jsonwebtoken"),
      { ROUTES, ROLE, ENV } = require("../resources/constants");

// Login route for admin accounts
exports.login = async (req, res) => {

    // check if the user is an admin
    const adminEmails = ENV.ADMIN_EMAILS?.split(',') || [];
    const adminPasswords = ENV.ADMIN_PASSWORDS?.split(',') || [];

    const emailIndex = adminEmails.findIndex(email => email === req.body.email);
    if (emailIndex < 0) return res.status(401).json({message: 'Admin auth failed'});

    const password = adminPasswords[emailIndex];
    if (!password || (password !== req.body.password)) 
        return res.status(401).json({message: 'Admin auth failed'});

    
    // generate token
    const token = jwt.sign(
        {
            email: adminEmails[emailIndex],
            userId: null,
            roles: [ROLE.ADMIN]
        },
        ENV.JWT_KEY,
        {
            expiresIn: "1h",
        }
      );

    res.status(200).json({
        message: 'Admin auth success',
        token,
    });
}

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
                url: `${ENV.BASE_URL}/${ROUTES.PRACTICEQ}/${saved._id}`,
            },
        }

        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error occurred while creating practice question',
            error: err
        });
    }
}

exports.updatePracticeQ = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

    try {
        const updatedQ = await PracticeQ
        .findOneAndUpdate({_id: id}, req.body, {new: true}).select('-__v');

        if (!updatedQ) return res.status(404).json({message: 'Question not found'});

        const response = {
            message: 'Practice question updated!',
            updated: updatedQ,
            request: {
                type: 'GET',
                url: `${ENV.BASE_URL}/${ROUTES.PRACTICEQ}/${id}`,
            },
        }

        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred while updating practice question',
            error: err
        });
    }
}

exports.deletePracticeQ = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

    try {
        // remove the references for this question from user attempts
        const userUpdate = await User.updateMany(
                {'attempts.practice.question': id},
                {$pull: {'attempts.practice': {question: id}}}
            );
        
        await PracticeQ.deleteOne({_id: id});
        
        res.status(200).json({
            message: 'Practice question deleted!',
            usersAffected: {
                matchedUsers: userUpdate.n,
                modifiedUsers: userUpdate.nModified
            },
            request: {
                type: 'POST',
                description: 'You can create a question with this URL',
                url: `${ENV.BASE_URL}/${ROUTES.PRACTICEQ}`,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred while deleting practice question',
            error: err
        });
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
              url: `${ENV.BASE_URL}/${ROUTES.COMPETEQ}/${saved._id}`,
            },
          });
        
      } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred while creating compete question',
            error: err
        });
      }
}

exports.updateCompeteQ = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

    try {
        const updatedQ = await CompeteQ
            .findOneAndUpdate({_id: id}, req.body, {new: true}).select('-__v');

        if (!updatedQ) return res.status(404).json({message: 'Question not found'});

        const response = {
        message: 'Compete question updated!',
        updated: updatedQ,
        request: {
            type: 'GET',
            url: `${ENV.BASE_URL}/${ROUTES.PRACTICEQ}/${id}`,
        },
        }

        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred while updating compete question',
            error: err
        });
    }
}

exports.deleteCompeteQ = async (req, res) => {
    const id = req.params[ROUTES.QUESTIONID];
    if (!id || id === '') return res.status(400).json({message: 'Question id is not present'});

    try {
        // remove the references for this question from user attempts
        const userUpdate = await User.updateMany(
                {'attempts.compete.question': id},
                {$pull: {'attempts.compete': {question: id}}}
            );

        await CompeteQ.deleteOne({_id: id});
        
        res.status(200).json({
            message: 'Compete question deleted!',
            usersAffected: {
                matchedUsers: userUpdate.n,
                modifiedUsers: userUpdate.nModified
            },
            request: {
                type: 'POST',
                description: 'You can create a question with this URL',
                url: `${ENV.BASE_URL}/${ROUTES.COMPETEQ}`,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred while deleting compete question',
            error: err
        });
    }
}

// ------------------
// tutorial handlers
exports.addTutorial = async (req, res) => {
    // check if req body is a valid tutorial
    if ((!req.body.level || req.body.level === '') || (!req.body.description || req.body.description === '')
        || (!req.body.subsection || req.body.subsection === '')) 
        return res.status(400).json({message: 'Some required fields are missing'}); 

    // parse values to number
    req.body.level = parseInt(req.body.level);
    req.body.subsection = parseInt(req.body.subsection);

    try {
        // check if tutorial for this level-subsection already exists
        const tutorialForThisLevel = await Tutorial.findOne({level: req.body.level, subsection: req.body.subsection});
        if (tutorialForThisLevel) return res.status(409).json({message: 'Tutorial for this level-subsection already exists'});

        // add new tutorial and/or subsection
        const saved = await new Tutorial({
            _id: new mongoose.Types.ObjectId(),
            level: req.body.level,
            subsection: req.body.subsection,
            description: req.body.description
        }).save();

        delete saved._doc.__v;

        res.status(201).json({
            message: 'Tutorial added successfully',
            created: saved,
            request: {
              type: 'GET',
              url: `${ENV.BASE_URL}/${ROUTES.TUTORIAL}/${saved._id}`,
            },
          });

    } catch (err) {
        res.status(500).json({
            message: 'Error occurred while adding tutorial',
            error: err
        });
    }

}

exports.editTutorial = async (req, res) => {
    // check id
    const tutorialId = req.params[ROUTES.TUTORIALID];
    if (!tutorialId) return res.status(400).json({message: 'Tutorial Id is not present'});

    // create update obj
    const updateObj = {};
    const updatebleKeys = ['level', 'subsection', 'description'];

    for (const [key, val] of Object.entries(req.body)) {
        if (updatebleKeys.includes(key))
            updateObj[key] = val;
    }

    // parse number values &
    // create find query condition
    if (updateObj.level)
        updateObj.level = parseInt(updateObj.level);
    if (updateObj.subsection)
        updateObj.subsection = parseInt(updateObj.subsection);

    try {   
        // perform the update
        const updated = await Tutorial.findOneAndUpdate({_id: tutorialId}, updateObj, {new: true})
                            .select('-__v');

        if (!updated) 
            return res.status(404).json({message: 'Could not find existing section for Id'});

        res.status(200).json({
            message: 'Tutorial edited successfully',
            updated,
        });
    } catch (err) {
        // handle unique index - level_subsection
        if (err.codeName && err.codeName === 'DuplicateKey') {
            return res.status(409).json({
            message: 'Error occured while updating section',
            error: {
                type: 'Duplicate value for unique attribute',
                keyValue: err.keyValue,
            }
            });
        }
        res.status(500).json({
            message: 'Error occurred while updating tutorial',
            error: err
        });
    }
}

exports.deleteTutorial = async (req, res) => {
    // check param
    const tutorialId = req.params[ROUTES.TUTORIALID];
    if (!tutorialId) return res.status(400).json({message: 'Tutorial Id is not present'});

    try {
        await Tutorial.deleteOne({_id: tutorialId});

        res.status(200).json({
            message: 'Tutorial deleted successfully',
            deleted: tutorialId,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error occurred while deleting tutorial',
            error: err
        });
    }
}

