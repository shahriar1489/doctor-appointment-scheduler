//var mongoose = require("mongoose");
let mongoose = require('mongoose'), Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const findOrCreate = require('mongoose-findorcreate')
const bcrypt = require("bcrypt");

let Patient = require("./patient")
//console.log(Patient);

// Doctor -> name, address (composite attribute) , speciality, phone - give address to patient
var doctorSchema = Schema({
    //_id = Schema.Types.ObjectId,
    email: { type: String, trim: true, required: true, unique: true },
    passwordHash: { type: String },

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


// Work on password and hashing below 
doctorSchema.index({ username: 1, googleId: 1 }, { unique: true });
doctorSchema.plugin(uniqueValidator); // I assume it checks if username is unique in db 
doctorSchema.plugin(findOrCreate); // 

//check the password against the saved salted hash
doctorSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

// save a salted hash of the password
doctorSchema.virtual("password").set(function (value) {
    this.passwordHash = bcrypt.hashSync(value, 12);
});


// Queries are below 
doctorSchema.statics.listAllPatients = function () {
    return this.find({});
};


// queries are below 
doctorSchema.statics.listAllDoctors = function () {
    return this.find({});
};

var doctorModel = mongoose.model('doctor', doctorSchema);

module.exports = doctorModel;