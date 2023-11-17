const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        shippingInfo: {
            firstName: {
                type: String,
                require: true
            },
            lastName: {
                type: String,
                require: true
            },
            mobile: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                require: true
            },
            city: {
                type: String,
                require: true
            }
        },
        paymentMethod: {
            type: String,
            require: true,
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    require: true
                },
                color: {
                    type: String,
                    require: true
                },
                quantity: {
                    type: Number,
                    require: true
                },
                price: {
                    type: Number,
                    require: true
                },
                priceAfterDiscount: {
                    type: Number,
                    require: true
                }
            }
        ],
        isPaid: {
            type: Boolean,
            default: false
        },
        paidAt: {
            type: Date,
        },
        month: {
            type: String,
            default: new Date().getMonth() + 1
        },
        itemsPrice: {
            type: Number,
            require: true
        },
        shippingPrice: {
            type: Number,
            require: true
        },
        totalPrice: {
            type: Number,
            require: true
        },
        orderStatus: {
            type: String,
            default: "Đã đặt hàng"
        }
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);