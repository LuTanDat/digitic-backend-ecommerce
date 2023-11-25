const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require('uniqid');

const asyncHandler = require("express-async-handler"); // bat loi ma khong can trycatch
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const validateMongoDbId = require("../utils/validateMongodbId");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");


const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("Tài khoản đã tồn tại trong hệ thống"); // thẩy thông báo lỗi cho express-async-handler, để xử lý ở middlewares chung
    }
})

// Login user

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exist or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findUser?._id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, { // luu len server xong mới phản hồi về client
            httpOnly: true, // chi truy cap duoc = HTTP, khong truy cap duoc = JAVASCRIPT
            maxAge: 72 * 60 * 60 * 1000, // time exists token, don vi milisecond
        });
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            address: findUser?.address,
            city: findUser?.city,
            isBlocked: findUser?.isBlocked,
            token: generateToken(findUser?._id),
            refreshToken: refreshToken,
        })
    } else {
        throw new Error("Thông tin không chính xác");
    }
})

// admin login

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authorised");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(
            findAdmin?._id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstName: findAdmin?.firstName,
            lastName: findAdmin?.lastName,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
            refreshToken: refreshToken,
        });
    } else {
        throw new Error("Thông tin không chính xác");
    }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => { // kiem tra token cu hop le thi moi tao token moi va tra ve cho nguoi dung
    // const cookie = req.cookies; // len server doc gia tri cookies
    // if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");// kiem tra xem nguoi dung co dang nhap ko ?
    // const refreshToken = cookie.refreshToken;
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error("No Refresh Token")
    const user = await User.findOne({ refreshToken });// kiem tra xem nguoi dung hop le ko ? tranh hacker gui mot token gia mao
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // forbidden
});

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
    const { _id } = req.user; // lay tu middleware
    validateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id, req.body,
            // {
            //     firstName: req?.body?.firstName,
            //     lastName: req?.body?.lastName,
            //     email: req?.body?.email,
            //     mobile: req?.body?.mobile,
            //     address: req?.body?.address,
            //     city: req?.body?.city,
            // },
            {
                new: true,
            }
        )
        res.json(updatedUser);
    } catch (err) {
        throw new Error(err);
    }
})


// save user Address

const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address,
            },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});


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
    validateMongoDbId(id);

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
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json({
            deletedUser
        });
    } catch (err) {
        throw new Error(err);
    }
})

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const blockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        //   res.json(blockusr);
        res.json({
            blockUser,
            message: "User Blocked"
        })
    } catch (error) {
        throw new Error(error);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const unBlockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            unBlockUser,
            message: "User UnBlocked",
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { oldPassword, newPassword } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (user && await user.isPasswordMatched(oldPassword)) {
        user.password = newPassword;
        const updatedPassword = await user.save();
        res.json({
            updatedPassword,
            message: "Updated Successfully"
        });
    } else {
        res.json({
            message: "Old Password not correct",
        });
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Xin chào, Vui lòng nhấp vào liên kết này để đặt lại Mật khẩu của bạn. Liên kết này có hiệu lực đến 10 phút kể từ bây giờ. <a href='http://localhost:3001/reset-password/${token}'>Click Here</>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;// chuoi random chua hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const getWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);
    } catch (error) {
        throw new Error(error);
    }
});


// tạo hoặc cập nhật giỏ hàng của người dùng

// const userCart = asyncHandler(async (req, res) => {
//     const { cart } = req.body;
//     const { _id } = req.user;
//     validateMongoDbId(_id);
//     try {
//         let products = [];
//         const user = await User.findById(_id);
//         // check if user already have product in cart
//         const alreadyExistCart = await Cart.findOne({ orderby: user._id });
//         if (alreadyExistCart) {
//             alreadyExistCart.remove(); // xoa gio hang cu cua nguoi dung, sau do thay the = gio hang moi
//         }
//         for (let i = 0; i < cart.length; i++) {
//             let object = {};
//             object.product = cart[i]._id;
//             object.count = cart[i].count;
//             object.color = cart[i].color;
//             let getPrice = await Product.findById(cart[i]._id).select("price").exec();
//             object.price = getPrice.price;
//             products.push(object);
//         }
//         let cartTotal = 0;
//         for (let i = 0; i < products.length; i++) {
//             cartTotal = cartTotal + products[i].price * products[i].count;
//         }
//         let newCart = await new Cart({ // save lai gio hang moi
//             products,
//             cartTotal,
//             orderby: user?._id,
//         }).save();
//         res.json(newCart);
//     } catch (error) {
//         throw new Error(error);
//     }
// });


// create cart
const userCart = asyncHandler(async (req, res) => {
    const { productId, color, quantity, price, priceAfterDiscount } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {

        let newCart = await new Cart({ // save lai gio hang moi
            userId: _id,
            productId,
            color,
            quantity,
            price,
            priceAfterDiscount
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});

// get all cart of user
const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.find({ userId: _id }).populate(
            "productId",
            // "_id title price totalAfterDiscount"
        ).populate("color");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

// delete a product in cart
const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    validateMongoDbId(_id);
    try {
        const deleteProductFromCart = await Cart.deleteOne({ userId: _id, _id: cartItemId })
        res.json(deleteProductFromCart);
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const deleteCart = await Cart.deleteMany({ userId: _id })
        res.json(deleteCart);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId, newQuantity } = req.params;
    validateMongoDbId(_id);
    let updateQuantity = true; // check so luong sp trong db con đủ khong ? đủ mới cho update

    try {
        const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });

        // Kiểm tra số lượng hàng tồn kho của sản phẩm trong đơn hàng
        const product = await Product.findById(cartItem?.productId);
        if (product?.quantity < newQuantity) {
            updateQuantity = false;
        }

        if (updateQuantity) {
            cartItem.quantity = newQuantity;
            cartItem.save();
            res.json({
                cartItem,
                message: 'SUCCESS'
            })
        } else {
            res.json({
                message: 'ERR'
            })
        }
    } catch (error) {
        throw new Error(error);
    }
});

// const createOrder = asyncHandler(async (req, res) => {
//     const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentMethod } = req.body;
//     const { _id } = req.user;
//     try {
//         const order = await Order.create({
//             shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentMethod, user: _id
//         })
//         res.json({
//             order,
//             success: true
//         })
//     } catch (error) {
//         throw new Error(error)
//     }
// })

const createOrder = asyncHandler(async (req, res) => {
    const { itemsPrice, shippingPrice, totalPrice, orderItems, paymentMethod, shippingInfo, isPaid, paidAt } = req.body;

    const { _id } = req.user;
    let updateQuantity = true; // check so luong sp trong db con đủ khong ? đủ mới cho đặt hàng
    let arrProduct = [];// mang chua cac sp khong du so luong trong db
    try {
        // Kiểm tra số lượng hàng tồn kho của từng sản phẩm trong đơn hàng
        const promises = orderItems.map(async (item) => {
            const product = await Product.findById(item?.product);
            if (product?.quantity < item?.quantity) {
                updateQuantity = false;
                arrProduct.push({
                    title: product.title,
                    quantity: product.quantity
                });
            }
            return updateQuantity;
        });

        // Đợi cho tất cả các promises được giải quyết hoặc từ chối
        const results = await Promise.all(promises)

        console.log("results: ", results);
        console.log("updateQuantity: ", updateQuantity);
        console.log("arrProduct: ", arrProduct);


        // Tất cả các sản phẩm đều có đủ hàng -> tạo đơn hàng mới và cập nhật số lượng hàng tồn kho và đã bán
        if (updateQuantity) {
            const createdOrder = await Order.create({
                itemsPrice, shippingPrice, totalPrice, orderItems, paymentMethod, shippingInfo, isPaid, paidAt, user: _id
            })

            // Cập nhật số lượng hàng tồn kho và đã bán cho từng sản phẩm trong đơn hàng
            const updatePromises = orderItems.map(async (item) => {
                const product = await Product.findById(item?.product);
                product.quantity -= item?.quantity;
                product.sold += item?.quantity;
                await product.save();
                return true;
            });

            // Đợi cho tất cả các promises được giải quyết hoặc từ chối
            await Promise.all(updatePromises);

            if (createOrder) {
                res.json({
                    createdOrder,
                    message: 'SUCCESS'
                })
            }
        } else {
            res.json({
                message: 'ERR',
                product: arrProduct
            })
        }

    } catch (error) {
        throw new Error(error)
    }
})

const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const orders = await Order.find({ user: _id })
            .populate("user")
            .populate("orderItems.product")
            .populate("orderItems.color")
            .sort("-createdAt"); // Sắp xếp theo thời gian tạo giảm dần
        res.json({
            orders
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("orderItems.product")
            .sort("-createdAt"); // Sắp xếp theo thời gian tạo giảm dần C1
        res.json({
            orders
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getSingleOrders = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const aOrder = await Order.findOne({ _id: id })
            .populate("user")
            .populate("orderItems.product")

        res.json(aOrder);
    } catch (error) {
        throw new Error(error);
    }
});

const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await Order.findById(id);
        orders.orderStatus = req.body.status;
        orders.save();
        res.json({
            orders
        });
    } catch (error) {
        throw new Error(error);
    }
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { orderItems } = req.body;
    try {
        const cancelAOrder = await Order.findByIdAndUpdate(id, {
            orderStatus: "Đã Hủy"
        })

        // Cập nhật số lượng hàng tồn kho và đã bán cho từng sản phẩm trong đơn hàng
        const updatePromises = orderItems.map(async (item) => {
            const product = await Product.findById(item?.product._id);
            product.quantity += item?.quantity;
            product.sold -= item?.quantity;
            await product.save();
            return true;
        });

        // Đợi cho tất cả các promises được giải quyết hoặc từ chối
        await Promise.all(updatePromises);

        res.json({
            cancelAOrder
        });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);

        // Cập nhật số lượng hàng tồn kho và đã bán cho từng sản phẩm trong đơn hàng
        const updatePromises = order?.orderItems?.map(async (item) => {
            const product = await Product.findById(item?.product._id);
            product.quantity += item?.quantity;
            product.sold -= item?.quantity;
            await product.save();
            return true;
        });

        // Đợi cho tất cả các promises được giải quyết hoặc từ chối
        await Promise.all(updatePromises);

        const deleteAOrder = await Order.findByIdAndDelete(id);
        res.json({
            deleteAOrder
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1);
        endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
    }
    // console.log(endDate)
    const data = await Order.aggregate([
        {
            $match: {// loc cac don hang
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                },
                orderStatus: { $ne: "Đã Hủy" } // Thêm điều kiện $ne (not equal) vào $match để chỉ lấy những đơn hàng có orderStatus khác "Đã Hủy".
            }
        }, {
            $group: { //nhom cac don hang
                _id: { // dieu kien de nhom
                    month: { $month: "$createdAt" }
                },
                amount: { $sum: "$totalPrice" }, // thuc hien tinh toan
                count: { $sum: 1 }
            }
        }, {
            $sort: {
                "_id.month": 1 // Sắp xếp theo tháng tăng dần
            }
        }
    ])
    res.json(data);
})

const getYearlyTotalOrders = asyncHandler(async (req, res) => {
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1);
        endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
    }
    // console.log(endDate)
    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                },
                orderStatus: { $ne: "Đã Hủy" } // Thêm điều kiện $ne (not equal) vào $match để chỉ lấy những đơn hàng có orderStatus khác "Đã Hủy".
            }
        }, {
            $group: {
                _id: {
                    year: { $year: "$createdAt" }
                },
                count: { $sum: 1 },
                amount: { $sum: "$totalPrice" }
            }
        }, {
            $sort: {
                "_id.year": 1 // Sắp xếp theo năm tăng dần
            }
        }
    ])
    res.json(data);
})

const countLowStockProducts = asyncHandler(async (req, res) => {
    try {
        const lowStockProductsCount = await Product.aggregate([
            {
                $match: {
                    quantity: { $lte: 15 } // Chỉ lấy sản phẩm có số lượng nhỏ hơn hoặc bằng 15
                }
            },
            {
                $count: "lowStockCount" // Đếm số lượng sản phẩm có số lượng nhỏ hơn hoặc bằng 15
            }
        ]);

        // Kết quả trả về sẽ là một mảng, nếu mảng rỗng tức là không có sản phẩm nào thỏa điều kiện
        const count = lowStockProductsCount.length > 0 ? lowStockProductsCount[0].lowStockCount : 0;

        res.json(count);
    } catch (error) {
        console.error(error);
    }
});

const calculateCategoryRevenue = asyncHandler(async (req, res) => {
    try {
        const categoryRevenue = await Order.aggregate([
            {
                $match: {
                    orderStatus: { $ne: 'Đã Hủy' },
                },
            },
            {
                $unwind: '$orderItems',
            },
            {
                $lookup: {
                    from: 'products', // Tên của collection của sản phẩm
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $group: {
                    _id: '$productDetails.category',
                    totalRevenue: { $sum: '$orderItems.priceAfterDiscount' },
                },
            }, {
                $sort: {
                    totalRevenue: -1 // Sắp xếp theo doanh thu giảm dần
                },
            },
        ]);

        res.json(categoryRevenue);
    } catch (error) {
        console.error(error);
    }
})

const inventoryStatsByCategory = asyncHandler(async (req, res) => {
    try {
        const inventoryStats = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalQuantity: { $sum: "$quantity" },
                },
            }, {
                $sort: {
                    totalQuantity: 1 // Sắp xếp tăng dần
                },
            },
        ]);

        res.json(inventoryStats);
    } catch (error) {
        console.error(error);
    }
})

const getOrderStatusCounts = asyncHandler(async (req, res) => {
    try {
        const orderStatusCounts = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            }, {
                $sort: {
                    count: -1
                },
            },
        ]);

        res.json(orderStatusCounts);
    } catch (error) {
        console.error(error);
    }
})

const getPaymentMethodCounts = asyncHandler(async (req, res) => {
    try {
        const paymentMethodCounts = await Order.aggregate([
            {
                $match: {
                    orderStatus: { $ne: 'Đã Hủy' },
                },
            },
            {
                $group: {
                    _id: "$paymentMethod",
                    count: { $sum: 1 },
                },
            }, {
                $sort: {
                    count: -1
                },
            },
        ]);

        res.json(paymentMethodCounts);
    } catch (error) {
        console.error(error);
    }
})

// const applyCoupon = asyncHandler(async (req, res) => {
//     const { coupon } = req.body;
//     const { _id } = req.user;
//     validateMongoDbId(_id);
//     const validCoupon = await Coupon.findOne({ name: coupon });
//     if (validCoupon === null) {
//         throw new Error("Invalid Coupon");
//     }
//     const user = await User.findOne({ _id });
//     let { cartTotal } = await Cart.findOne({
//         orderby: user._id,
//     }).populate("products.product");
//     let totalAfterDiscount = (
//         cartTotal -
//         (cartTotal * validCoupon.discount) / 100
//     ).toFixed(2);
//     await Cart.findOneAndUpdate(
//         { orderby: user._id },
//         { totalAfterDiscount },
//         { new: true }
//     );
//     res.json(totalAfterDiscount);
// });

// const createOrder = asyncHandler(async (req, res) => {
//     const { COD, couponApplied } = req.body;
//     const { _id } = req.user;
//     validateMongoDbId(_id);
//     try {
//         if (!COD) throw new Error("Create cash order failed");
//         const user = await User.findById(_id);
//         let userCart = await Cart.findOne({ orderby: user._id });
//         let finalAmout = 0;
//         if (couponApplied && userCart.totalAfterDiscount) {
//             finalAmout = userCart.totalAfterDiscount;
//         } else {
//             finalAmout = userCart.cartTotal;
//         }

//         let newOrder = await new Order({
//             products: userCart.products,
//             paymentIntent: {
//                 id: uniqid(),
//                 method: "COD",
//                 amount: finalAmout,
//                 status: "Cash on Delivery",
//                 created: Date.now(),
//                 currency: "usd",
//             },
//             orderby: user._id,
//             orderStatus: "Cash on Delivery",
//         }).save();
//         // update san pham ton kho va da ban
//         let update = userCart.products.map((item) => {
//             return {
//                 updateOne: {
//                     filter: { _id: item.product._id },
//                     update: { $inc: { quantity: -item.count, sold: +item.count } },
//                 },
//             };
//         });
//         const updated = await Product.bulkWrite(update, {}); // cap nhat hang loat san pham trong DB
//         res.json({ message: "success" });
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const getOrderByUserId = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validateMongoDbId(id);
//     try {
//         const userorders = await Order.findOne({ orderby: id })
//             .populate("products.product")
//             .populate("orderby")
//             .exec();
//         res.json(userorders);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const updateOrderStatus = asyncHandler(async (req, res) => {
//     const { status } = req.body;
//     const { id } = req.params;
//     validateMongoDbId(id);
//     try {
//         const updateOrderStatus = await Order.findByIdAndUpdate(
//             id,
//             {
//                 orderStatus: status,
//                 paymentIntent: {
//                     status: status,
//                 },
//             },
//             { new: true }
//         );
//         res.json(updateOrderStatus);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    removeProductFromCart,
    updateProductQuantityFromCart,
    createOrder,
    getMyOrders,
    getAllOrders,
    getSingleOrders,
    updateOrder,
    cancelOrder,
    getMonthWiseOrderIncome,
    getYearlyTotalOrders,
    calculateCategoryRevenue,
    getOrderStatusCounts,
    getPaymentMethodCounts,
    countLowStockProducts,
    inventoryStatsByCategory,
    deleteOrder,
    emptyCart,

    // applyCoupon,
    // createOrder,
    // getOrderByUserId,
    // updateOrderStatus,

}