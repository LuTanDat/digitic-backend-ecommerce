const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser"); // xu ly va quan ly cookie
const morgan = require("morgan"); // theo doi va ghi log lai yêu cầu HTTP đến máy chủ web 
dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());// Middleware này cho phép ứng dụng đọc dữ liệu dạng JSON và dữ liệu form được gửi từ client.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
})