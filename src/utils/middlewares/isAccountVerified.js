module.exports = async (req, res, next) => {
    try {
        const isVerified = req.user.isVerified;
        console.log(isVerified);
        if (!isVerified) {
            req.flash('message', 'You need to verify your account')
            return res.render('./../../views/Pages/PostUpload/index.ejs')
        }
        next()
    } catch (err) {
        next(err)
    }
}