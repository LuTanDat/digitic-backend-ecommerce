const Supplier = require("../models/supplierModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createSupplier = asyncHandler(async (req, res) => {
    try {
        const newSupplier = await Supplier.create(req.body);
        res.json(newSupplier);
    } catch (error) {
        throw new Error(error);
    }
});

const updateSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedSupplier);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(id);
        res.json(deletedSupplier);
    } catch (error) {
        throw new Error(error);
    }
});

const getSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaSupplier = await Supplier.findById(id);
        res.json(getaSupplier);
    } catch (error) {
        throw new Error(error);
    }
});
const getallSupplier = asyncHandler(async (req, res) => {
    try {
        const getallSupplier = await Supplier.find();
        res.json(getallSupplier);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplier,
    getallSupplier
}