// middleware not found

const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error); // chuyển lỗi này đến middleware tiếp theo
}

// middleware error Handler: nhận lỗi từ bất kỳ middlware khác nào và xử lý tiếp

const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: err?.message,
        stack: err?.stack,
    })
}

module.exports = { errorHandler, notFound }