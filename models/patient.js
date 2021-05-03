
var mongoose = require('mongoose'), Schema = mongoose.Schema;

let Doctor = require("./doctor")

var patientSchema = new mongoose.Schema({
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' }, // keeping mongoose.ObjectId, returns no error

    first_name: { type: String, required: true, },
    last_name: { type: String, required: true },

    age: { type: Number, required: true, },
    blood_group: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], }, // enum the blood groups  

    urgent: { type: Boolean, required: true, default: true },


});

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