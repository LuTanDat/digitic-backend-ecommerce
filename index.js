const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogCategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const supplierRouter = require("./routes/supplierRoute");
const importNoteRouter = require("./routes/importNoteRoute");
const paymentRouter = require("./routes/paymentRoute");


const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser"); // xu ly va quan ly cookie
const morgan = require("morgan"); // theo doi va ghi log lai yêu cầu HTTP đến máy chủ web 
const cors = require('cors');

dbConnect();

app.use(morgan("dev"));

// Cấu hình CORS
// c1 app.use(cors());
// c2
app.use(cors({
    origin: "*", // Đặt domain của máy khách của bạn, hoặc "*" để cho phép từ tất cả các domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức HTTP được phép
    credentials: true, // Cho phép gửi và nhận cookie và các thông số khác qua CORS
}));

app.use(bodyParser.json());// Middleware này cho phép ứng dụng đọc dữ liệu dạng JSON và dữ liệu form được gửi từ client.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/importNote", importNoteRouter);
app.use("/api/payment", paymentRouter);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
})