const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler"); // bat loi ma khong can trycatch
const slugify = require("slugify"); // chuyen doi noi dung thanh slug tren URL

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params;
    // validateMongoDbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
            new: true,
        });
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params;
    // validateMongoDbId(id);
    try {
        const deleteProduct = await Product.findOneAndDelete(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // validateMongoDbId(id);
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // Filtering
        //ex: path?price[gte]=12501&price[lte]=42000

        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"]; // loai bo cac tham so ko can thiet
        excludeFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // xu ly ky tu dac biet

        let query = Product.find(JSON.parse(queryStr));

        // Sorting
        // ex: path?sort=-category,-brand

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // limiting the fields
        // ex: path?fields=title,price,category: chi lay 3 fields nay. else lay all bỏ 3 fields thi them dau tru o truoc field muon bo

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        // pagination
        //ex: path?page=1&limit=3

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);//bỏ mấy cái, xong lấy mấy cái
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This Page does not exists");
        }


        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
}