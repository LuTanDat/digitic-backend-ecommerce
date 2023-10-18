const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var importNoteSchema = new mongoose.Schema({
    nameSupplier: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('ImportNote', importNoteSchema);