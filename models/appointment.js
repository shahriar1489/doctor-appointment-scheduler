let mongoose = require('mongoose'), Schema = mongoose.Schema;

let Patient = require("./appointment")
let Doctor = require("./doctor")

//console.log(Patient);

// Appointment -> id, time, foreign key(s): date(many-to-one), doctor(one-to-one), patient(one-to-one) 
var appointmentSchema = Schema({
    valid: { type: Boolean, default: true }, // -->> the doctor overrides this 
    message_from_doctor: { type: String, trim: true, },

    //date_time: {}, 
    //take: { type: Date, default: Date.now, required: true }, ->> create 10 appointments per day 

    taken: { type: Boolean, default: false },
    patient: [{ type: Schema.Types.ObjectId, ref: 'Patient' }], // one patient 
    doctor: [], // one doctor 

    // day // Monday to Saturday... (should work as foreign key) -->> many appointment - one day
    /*
    practice_type: { type: String, required: true, enum: ['Private Chamber', 'Private Clinic',], }, // enum the blood groups 
    */
});

appointmentSchema.statics.listAllAppointments = function () {
    return this.find({});
};

var appointmentModel = mongoose.model('appointment', appointmentSchema);

module.exports = appointmentModel;