exports.errorHandler = (error, req, res, next) => {
    console.log(error.name);
    
    if (error.name === 'ValidationError') {
        const formattedErrors = error.inner.map(err => ({
            field: err.path,
            message: err.message
        }));

        
        return res.status(400).json({
            success: false,
            errors: formattedErrors
        });
    }

    return res.status(500).json({
        success: false,
        message: error.message || 'Server Error'
    });
}