const User = require("../models/userModel");
const asyncHandler = require("express-async-handler"); // bat loi ma khong can trycatch
const { generateToken } = require("../config/jwtToken");

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User Already Exists"); // thẩy thông báo lỗi cho express-async-handler, để xử lý ở middlewares chung
    }
})

// Login user

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exist or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        })
    } else {
        throw new Error("Invalid Credentials");
    }
})

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
    const { id } = req.params; // lay dong tren url
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
                new: true,
            }
        )
        res.json(updatedUser);
    } catch (err) {
        throw new Error(err);
    }
})


// Get all users

const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (err) {
        throw new Error(err);
    }
})

// Get a single user

const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params; // lay dong tren url
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser
        });
    } catch (err) {
        throw new Error(err);
    }
})

// Delete a single user

const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params; // lay dong tren url
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser
        });
    } catch (err) {
        throw new Error(err);
    }
})

module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,

}