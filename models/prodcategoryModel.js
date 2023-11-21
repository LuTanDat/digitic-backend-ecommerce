const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var prodcategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    images: [
        {
            public_id: String,
            url: String,
        },
    ],
},
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('PCategory', prodcategorySchema);