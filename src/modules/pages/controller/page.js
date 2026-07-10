const hasAccessToPage = require("./../../../utils/hasAccessToPage");
const followModel = require('./../../follower/model/Follower');

exports.getPage = async (req, res, next) => {
    try {
        const userID = req.user._id.toString();

        const { pageID } = req.params;

        const hasAccess = await hasAccessToPage(userID, pageID);

        const followStatus = await followModel.findOne({ follower: userID, following: pageID }).lean();

        if (!hasAccess) {
            req.flash('error', 'Follow Page To Show Content')
            return res.render('./Pages/Profiles/index', {
                followStatus: Boolean(followStatus),
                pageID
            })
        };

        res.render('./Pages/Profiles/index', {
            followStatus: Boolean(followStatus),
            pageID
        })
    } catch (err) {
        next(err)
    }
}

exports.follow = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
}

exports.unFollow = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
}