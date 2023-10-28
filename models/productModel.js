const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: String,
            required: true,
        },
        // color: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
        color: {
            type: String,
            require: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        sold: {
            type: Number,
            default: 0,
            // select: false, // an sold khi nguoi dung get product
        },
        size: {
            type: String,
            required: true,
        },
        weight: {
            type: String,
            required: true,
        },
        power: {
            type: String,
        },
        lifespan: {
            type: String,
            required: true,
        },
        warranty: {
            type: String,
            required: true,
        },
        images: [
            {
                public_id: String,
                url: String,
            },
        ],
        ratings: [
            {
                star: Number,
                comment: String,
                postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            },
        ],
        totalrating: {
            type: String,
            default: 0,
        },
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);