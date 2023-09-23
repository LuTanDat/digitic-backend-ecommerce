const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    liketheBlog,
    disliketheBlog,
} = require("../controller/blogCtrl");


router.post('/', authMiddleware, isAdmin, createBlog);

router.put('/likes', authMiddleware, liketheBlog);
router.put("/dislikes", authMiddleware, disliketheBlog);

router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlogs);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);



module.exports = router;