module.exports = async (req, res, next) => {
    try {
        const isVerified = req.user.isVerified;
        
        if (!isVerified) {
            req.flash('message', 'You need to verify your account')
            return res.render('./Pages/PostUpload/index.ejs')
        }
        next()
    } catch (err) {
        next(err)
    }
}