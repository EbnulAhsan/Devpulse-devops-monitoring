import { ErrorRequestHandler } from 'express';

const gloalErrorHandelar: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';

    res.status(statusCode).json({
        success: false,
        message: message,
        errors: err,
    });
};

export default gloalErrorHandelar;