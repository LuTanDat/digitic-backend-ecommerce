const multer = require("multer"); // middleware xu ly tai len tep
const sharp = require("sharp"); // resize, format image
const path = require("path"); // lam viec voi path
const fs = require("fs"); // lam viec voi file

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images/"));
    },
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) { //co phai la image khong ?
        cb(null, true);
    } else {
        cb({ message: "Unsupported file format" }, false);
    }
};

const uploadPhoto = multer({
    storage: multerStorage, // cau hinh luu tru
    fileFilter: multerFilter, // loc hinh
    limits: { fileSize: 1000000 }, // limit file image upload max 1MB
});

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 }) // quality = 90% goc
                .toFile(`public/images/products/${file.filename}`); // dia chi luu file sau khi xu ly
            // fs.unlinkSync(`public/images/products/${file.filename}`); // xoa file goc
        })
    );
    next();
};

const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/blogs/${file.filename}`);
            // fs.unlinkSync(`public/images/blogs/${file.filename}`);
        })
    );
    next();
};
module.exports = { uploadPhoto, productImgResize, blogImgResize };