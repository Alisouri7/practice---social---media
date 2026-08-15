exports.errorHandler = (error, req, res, next) => {

    if (error.name === 'ValidationError') {
        let formattedErrors = null;

        if (error.inner.length === 0) {

            formattedErrors = [{
                field: error.path,
                message: error.errors[0]
            }]

        } else {

            formattedErrors = error.inner.map(err => ({
                field: err.path,
                message: err.message
            }));

        }


        return res.status(400).json({
            success: false,
            errors: formattedErrors
        });
        
    } else {

        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });

    }

}