let mongoose = require('mongoose'), Schema = mongoose.Schema;

let Appointment = require('./appointment.js');

const uniqueValidator = require("mongoose-unique-validator");
const findOrCreate = require('mongoose-findorcreate')
const bcrypt = require("bcrypt");
const passportLocalMongoose = require('passport-local-mongoose');




let patientSchema = new mongoose.Schema({
    //doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' }, // keeping mongoose.ObjectId, returns no error

    first_name: { type: String, required: true, },
    last_name: { type: String, required: true },

    username: { type: String, required: true, unique: true }, //
    //    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    age: { type: Number, required: true, },
    blood_group: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], default: 'A+' }, // enum the blood groups  

    qualification: { type: String, required: true, trim: true, default: 'patient' },
    specialization: { type: String, required: true, trim: true, default: 'patient' },

    role: { type: String, required: true, enum: ['doctor', 'patient'] },

    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment"
    }],//  one patient can have many appointments     
});


// Work on password and hashing below 
patientSchema.index({ username: 1, googleId: 1 }, { unique: true });
patientSchema.plugin(uniqueValidator); // I assume it checks if username is unique in db 
patientSchema.plugin(findOrCreate); // 

// Add the passportLocal pluging below
patientSchema.plugin(passportLocalMongoose); // call this before patientModel.model(...) as per documentation

//check the password against the saved salted hash
patientSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

// save a salted hash of the password
patientSchema.virtual("password").set(function (value) {
    this.passwordHash = bcrypt.hashSync(value, 12);
});


// Queries are below 

patientSchema.statics.listAllDoctors = function () {
    return this.find({ role: 'doctor' });
};


patientSchema.statics.listAllPatients = function () {
    return this.find({ role: 'patient' });
};


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
/*
patientSchema.statics.patientEmail = function (email) { // 4/17/2021 
    // custom query goes here: for urgent=true 
    return this.find({ email: { email });
}*/

patientSchema.statics.getDrFiroz = function () {
    return this.find({ username: 'firoz@gmail.com' });
}

/*
patientSchema.statics.populateTest = function () {
    return this.findOne({ username: 'firoz@gmail.com' })
        .populate("appointments") // key to populate
        .then(user => {
            console.log('In then: ' + user);
            res.json(user);
            res.render(JSON.stringify(user));
        }).catch(err => {
            console.log('Error: ' + Error);
            res.send(err)
        });
}
*/

var patientModel = mongoose.model('patient', patientSchema);

module.exports = patientModel;