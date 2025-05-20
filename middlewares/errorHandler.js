// const notFound = (req, res, next) => {
//     const error = new Error(`Not Found: ${req.originalUrl}`);
//     res.status(404);
//     next(error);
// };

// //Error handler
// const errorHandler = (err, req, res, next)=> {
//     const statuscode = res.statusCode==200 ? 500 : res.statusCode;
//     res.status(statuscode);
//     res.json({
//         message: err?.message,
//         stack: err?.stack,
//     });
// };

// module.exports = {errorHandler, notFound};

// Custom 404 handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// General error handler
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { notFound, errorHandler };
