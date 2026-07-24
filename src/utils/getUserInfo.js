const userModel = require('./../modules/users/model/User');

const getUserInfo = async (userID) => {
    const user = await userModel.findOne({_id: userID}).lean();
    return user
};

module.exports = getUserInfo;