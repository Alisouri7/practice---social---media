const hasAccessToPage = require("../../../utils/hasAccessToPage")


exports.getPage = async (req, res, next) => {
    try {
        const user = req.user;
        const { pageID } = req.params;

        const hasAccess = await hasAccessToPage(user._id, pageID);

        if (!hasAccess) {
            req.flash('error', 'Follow Page To Show Content')
            return res.render('./index')
        };

        res.render('./Pages/Profiles/index')
    } catch (err) {
        next(err)
    }
}