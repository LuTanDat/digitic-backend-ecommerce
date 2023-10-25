const Coupon = require("../models/couponModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const asynHandler = require("express-async-handler");

const createCoupon = asynHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCoupons = asynHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find().populate("product");
        res.json(coupons);
    } catch (error) {
        throw new Error(error);
    }
});
const updateCoupon = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatecoupon = await Coupon.findOneAndUpdate({ product: id }, req.body, {
            new: true,
        });
        res.json(updatecoupon);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteCoupon = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletecoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletecoupon);
    } catch (error) {
        throw new Error(error);
    }
});
const getCoupon = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getAcoupon = await Coupon.findOne({ product: id }).populate("product");
        res.json(getAcoupon);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    getCoupon,
}