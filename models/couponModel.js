const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: true
    },
    discount: {
        type: Number,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
});

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);