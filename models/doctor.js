//var mongoose = require("mongoose");

var mongoose = require('mongoose'), Schema = mongoose.Schema;

let Patient = require("./patient")
//console.log(Patient);

// Doctor -> name, address (composite attribute) , speciality, phone - give address to patient
var doctorSchema = Schema({
    //_id = Schema.Types.ObjectId,

    first_name: { type: String, trim: true, required: true },
    last_name: { type: String, trim: true, required: true },
    age: { type: Number, }, // add restriction
    qualification: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    /*
        profile_picture: 
    */
    //present: { type: Boolean, required: true, },

    //joined: { type: Date, default: Date.now, required: true },

    appintments: []//
    /*
    practice_type: { type: String, required: true, enum: ['Private Chamber', 'Private Clinic',], }, // enum the blood groups 
    */
});

doctorSchema.statics.listAllDoctors = function () {
    return this.find({});
};

var doctorModel = mongoose.model('doctor', doctorSchema);

module.exports = doctorModel;