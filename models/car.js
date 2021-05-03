var mongoose = require("mongoose");

var carSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number,
    color: String
});

carSchema.statics.listAllCars = function () {
    return this.find({});
};

var carModel = mongoose.model('car', carSchema);

module.exports = carModel;
