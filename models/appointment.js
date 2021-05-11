let mongoose = require('mongoose'), Schema = mongoose.Schema;

let Patient = require("./patient");
let Doctor = require("./doctor");
let Comment = require("./comment");

//console.log(Patient);

// Appointment -> id, time, foreign key(s): date(many-to-one), doctor(one-to-one), patient(one-to-one) 
var appointmentSchema = Schema({
    valid: { type: Boolean, default: true }, // -->> the doctor overrides this 
    taken: { type: Boolean, default: false },
    slot: {
        type: String,
        required: true,
        enum: ['17:00-17:25', '17:35-18:00', '18:10-18:35', '18:45-19:10', '19:20-19:45']
    },

    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    }, // one patient 

    doctor: {
        type: Schema.Types.ObjectId, ref: 'Patient'
    }, // one doctor 

    note: {
        type: String, trim: true,
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
    // day // Monday to Saturday... (should work as foreign key) -->> many appointment - one day
});

appointmentSchema.statics.listAllAppointments = function () {
    return this.find({});
};

//appointmentSchema.statics.


var appointmentModel = mongoose.model('appointment', appointmentSchema);
module.exports = appointmentModel;