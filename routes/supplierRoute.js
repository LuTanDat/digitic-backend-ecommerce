const express = require("express");
const {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplier,
    getallSupplier,

} = require("../controller/supplierCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createSupplier);
router.put("/:id", authMiddleware, isAdmin, updateSupplier);
router.delete("/:id", authMiddleware, isAdmin, deleteSupplier);
router.get("/:id", getSupplier);
router.get("/", getallSupplier);

module.exports = router;