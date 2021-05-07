//var mongoose = require("mongoose");

var mongoose = require('mongoose'), Schema = mongoose.Schema;

let Patient = require("./patient")
//console.log(Patient);

// Doctor -> name, address (composite attribute) , speciality, phone - give address to patient
var doctorSchema = Schema({
    //_id = Schema.Types.ObjectId,
    email: { type: String, trim: true, required: true, unique: true },

    first_name: { type: String, trim: true, required: true },
    last_name: { type: String, trim: true, required: true },
    // age: { type: Number, }
    qualification: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },

    //appointments: []//
    /*
        profile_picture + location
    */

});

doctorSchema.statics.listAllDoctors = function () {
    return this.find({});
};

var doctorModel = mongoose.model('doctor', doctorSchema);

module.exports = doctorModel;