const ImportNote = require("../models/importNoteModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createImportNote = asyncHandler(async (req, res) => {
    try {
        const newImportNote = await ImportNote.create(req.body);
        res.json(newImportNote);
    } catch (error) {
        throw new Error(error);
    }
});

const updateImportNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedImportNote = await ImportNote.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedImportNote);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteImportNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedImportNote = await ImportNote.findByIdAndDelete(id);
        res.json(deletedImportNote);
    } catch (error) {
        throw new Error(error);
    }
});

const getImportNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaImportNote = await ImportNote.findById(id);
        res.json(getaImportNote);
    } catch (error) {
        throw new Error(error);
    }
});
const getallImportNote = asyncHandler(async (req, res) => {
    try {
        const getallImportNote = await ImportNote.find();
        res.json(getallImportNote);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createImportNote,
    updateImportNote,
    deleteImportNote,
    getImportNote,
    getallImportNote
}