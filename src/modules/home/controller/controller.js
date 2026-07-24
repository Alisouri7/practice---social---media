const getUserInfo = require("../../../utils/getUserInfo")

exports.showHomeView = async (req, res, next) => {
    const user = await getUserInfo(req.user._id);

    return res.render('./index', {
    user
    })
}