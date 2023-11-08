const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary");
const fs = require("fs");
const asyncHandler = require("express-async-handler"); // bat loi ma khong can trycatch

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = []; // arr path img tren cloud
    const files = req.files; // get all file from Frontend
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path); // up img len cloud and return path tren cloud
      urls.push(newpath);
      fs.unlinkSync(path);// delete image path
    }
    const images = urls.map((file) => {
      return file;
    })
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
})

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({
      deletedImageId: id,
      message: "Deleted"
    });
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = {
  uploadImages,
  deleteImages,
}