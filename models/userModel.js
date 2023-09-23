const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    {
        timestamps: true,
    }
);

// ham nay chay truoc khi luu data vao db
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) { // thay doi khi reset password
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// dinh nghia mot method tuy y
userSchema.methods.isPasswordMatched = async function (enterdPassword) {
    return await bcrypt.compare(enterdPassword, this.password);
}

userSchema.methods.createPasswordResetToken = async function () { // tao token de reset password, de phan biet khi nhieu nguoi cung yeu cau reset password
    const resettoken = crypto.randomBytes(32).toString("hex"); // tao ma ngau nhien
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resettoken)
        .digest("hex"); // ma hoa 
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
    return resettoken;
};

//Export the model
module.exports = mongoose.model('User', userSchema);