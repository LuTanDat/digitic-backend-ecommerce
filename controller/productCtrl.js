const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler"); // bat loi ma khong can trycatch


const createProduct = asyncHandler(async (req, res) => {
    try {
        // if (req.body.title) {
        //   req.body.slug = slugify(req.body.title);
        // }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
})


module.exports = {
    createProduct,

}