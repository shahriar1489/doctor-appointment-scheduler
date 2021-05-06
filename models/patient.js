
let mongoose = require('mongoose'), Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const findOrCreate = require('mongoose-findorcreate')


let Doctor = require("./doctor")

let patientSchema = new mongoose.Schema({
    //doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' }, // keeping mongoose.ObjectId, returns no error

    first_name: { type: String, required: true, },
    last_name: { type: String, required: true },

    username: { type: String, required: true, }, //
    passwordHash: { type: String },

    age: { type: Number, required: true, },
    blood_group: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], }, // enum the blood groups  
    /*
        //urgent: { type: Boolean, required: true, default: true },
    */

});


// Work on password and hashing below 
patientSchema.index({ username: 1, googleId: 1 }, { unique: true });
patientSchema.plugin(uniqueValidator); // I assume it checks if username is unique in db 
patientSchema.plugin(findOrCreate); // 

//check the password against the saved salted hash
patientSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

// save a salted hash of the password
patientSchema.virtual("password").set(function (value) {
    this.passwordHash = bcrypt.hashSync(value, 12);
});


// Queries are below 
patientSchema.statics.listAllPatients = function () {
    return this.find({});
};

// 

patientSchema.statics.patientAge = function (ag) {
    // custom query goes here : for patient>60 
    return this.find({ age: { $gte: ag } });

    // What will callback do here? 
    /*

    */
}

patientSchema.statics.patientIsUrgent = function () { // 4/17/2021 
    // custom query goes here: for urgent=true 
    return this.find({ urgent: true });
}


var patientModel = mongoose.model('patient', patientSchema);

module.exports = patientModel;