const userModel = require('./../modules/users/model/User');
const followModel = require('./../modules/follower/model/Follower');

module.exports = async (userID, pageID) => {
    try {
        
        if (userID === pageID) return true;

        const page = await userModel.findOne({ _id: pageID }).lean();
        
        
        if (!page.private) return true;

        const followStatus = await followModel.findOne({ follower: userID, following: pageID }).lean();

        if (!followStatus) return false;

        return true;
    } catch (error) {
        console.log(error);
        
    }
}