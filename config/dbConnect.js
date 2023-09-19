const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    // try {
    //     const conn = mongoose.connect(process.env.MONGODB_URL);
    //     console.log("Connected to the database!");
    // } catch (error) {
    //     console.log("Cannot connect to the database!");
    // }


    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("Connected to the database!");
        })
        .catch((error) => {
            console.log("Cannot connect to the database!");
            process.exit();
        });
}
module.exports = dbConnect;