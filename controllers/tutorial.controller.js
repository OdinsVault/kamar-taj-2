const Tutorial = require("../models/tutorial"),
      {ROUTES} = require('../resources/constants');


exports.getTutorialByLevel = async (req, res) => {
    // check level param
    const tutorialLevel = req.params[ROUTES.TUTORIALLEVEL];
    if (!tutorialLevel || tutorialLevel === '')
        return res.status(400).json({message: 'Tutorial level is not present'});

    try {
        // get all subsection sorted in asc
        const tutorialSections = await Tutorial.find({level: parseInt(tutorialLevel)})
                                        .sort('subsection')
                                        .select('-__v');
        
        res.status(200).json({
            message: 'Tutorial sections by level fetched successfully',
            requestedLevel: parseInt(tutorialLevel),
            sections: tutorialSections,
        });
        
    } catch (err) {
        res.status(500).json({
            message: 'Error occurred while getting tutorial sections by level',
            error: err
        });
    }
}

exports.getTutorialById = async (req, res) => {
    // check id param
    const tutorialId = req.params[ROUTES.TUTORIALID];
    if (!tutorialId || tutorialId === '')
        return res.status(400).json({message: 'Tutorial id is not present'});

    try {
        // find & send the section if found
        const section = await Tutorial.findById(tutorialId).select('-__v');
        if (!section) return res.status(404).json({
            message: 'No tutorial section found by provided Id',
        });

        res.status(200).json({
            message: 'Tutorial section fetched',
            section
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error occurred while getting tutorial section by Id',
            error: err
        });
    }
}