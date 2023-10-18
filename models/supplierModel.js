const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var supplierSchema = new mongoose.Schema({
    name: {
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
    address: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Supplier', supplierSchema);