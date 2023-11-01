const express = require("express");
const { createUser,
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
    createOrder,
    removeProductFromCart,
    updateProductQuantityFromCart,
    getMyOrders,
    getMonthWiseOrderIncome,
    getYearlyTotalOrders,
    getAllOrders,
    getSingleOrders,
    updateOrder,
    deleteOrder,
    emptyCart,
    cancelOrder,

} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");
const router = express.Router();

router.post("/register", createUser);

router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
// router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);

router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/order/checkout", authMiddleware, checkout);
router.post("/order/paymentVerification", authMiddleware, paymentVerification);
// router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, createOrder);
router.get("/all-users", getallUser);
router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.get("/getaOrder/:id", authMiddleware, isAdmin, getSingleOrders);
router.put("/updateOrder/:id", authMiddleware, isAdmin, updateOrder);
router.put("/cancelOrder/:id", cancelOrder);
// router.get("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);
// router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getAllOrders);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishList);
router.get("/cart", authMiddleware, getUserCart);
router.get("/getMonthWiseOrderIncome", authMiddleware, getMonthWiseOrderIncome);
router.get("/getYearlyTotalOrders", authMiddleware, getYearlyTotalOrders);

router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/delete-product-cart/:cartItemId", authMiddleware, removeProductFromCart);
router.delete("/update-product-cart/:cartItemId/:newQuantity", authMiddleware, updateProductQuantityFromCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteaUser);
router.delete("/deleteOrder/:id", authMiddleware, isAdmin, deleteOrder);

router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", blockUser);
router.put("/unblock-user/:id", unblockUser);

module.exports = router;