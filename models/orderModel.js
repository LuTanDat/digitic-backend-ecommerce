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
            },
            // state: {
            //     type: String,
            //     require: true
            // },
            // other: {
            //     type: String,
            //     require: true
            // },
            // pincode: {
            //     type: Number,
            //     require: true
            // },
        },
        paymentMethod: {
            type: String,
            require: true,
        },
        // paymentInfo: {
        //     razorpayOrderId: {
        //         type: String,
        //         require: true
        //     },
        //     razorpayPaymentId: {
        //         type: String,
        //         require: true
        //     }
        // },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    require: true
                },
                color: {
                    // type: mongoose.Schema.Types.ObjectId,
                    // ref: "Color",
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
        totalPrice: {
            type: Number,
            require: true
        },
        totalPriceAfterDiscount: {
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