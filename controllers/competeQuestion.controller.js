
const CompeteQ = require('../models/competeQuestion'),
      { ROUTES, ENV } = require('../resources/constants');

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
                        url: `${ENV.BASE_URL}/${ROUTES.COMPETEQ}/${q._id}`
                    }
                }
            }),
        };

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred while fetching compete questions',
            error: err
        });
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
            { $group: { _id: '$category', questions: { $push: '$$ROOT' } } },
            { $sort: { _id: 1 } }
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
        res.status(500).json({
            message: 'Error occurred while fetching compete questions by category',
            error: err
        });
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
        res.status(500).json({
            message: 'Error occurred while fetching compete question by Id',
            error: err
        });
    }
}


