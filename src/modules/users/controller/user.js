const userModel = require('./../model/User');

exports.showEditPageView = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ _id: req.user._id });


        return res.render('./Pages/ProfileUpdate/index', {
            user
        })
    } catch (error) {
        next(error)
    }
};


exports.updateProfile = async (req, res, next) => {
    try {
        const userID = req.user._id;
        const {name, username, email, password} = req.body;
        
        if (!req.file) {
            req.flash('error', 'choose a photo')
            return res.redirect('/users/edit-profile')
        }

        const { filename } = req.file;

        const profilePath = `/images/profiles/${filename}`

        const user = await userModel.findOneAndUpdate(
            { _id: userID },
            { profilePicture: profilePath },
            { new: true }                                       //returns updated doc
        ).lean();


        req.flash('success', 'profile updated successfully')
        return res.redirect('/users/edit-profile')
    } catch (error) {
        next(error)
    }
}