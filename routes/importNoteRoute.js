const express = require("express");
const {
    createImportNote,
    updateImportNote,
    deleteImportNote,
    getImportNote,
    getallImportNote,

} = require("../controller/importNoteCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createImportNote);
router.put("/:id", authMiddleware, isAdmin, updateImportNote);
router.delete("/:id", authMiddleware, isAdmin, deleteImportNote);
router.get("/:id", getImportNote);
router.get("/", getallImportNote);

module.exports = router;