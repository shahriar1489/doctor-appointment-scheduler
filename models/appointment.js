let mongoose = require('mongoose'), Schema = mongoose.Schema;

let Patient = require("./patient");
let Doctor = require("./doctor");
let Comment = require("./comment");

//console.log(Patient);

// Appointment -> id, time, foreign key(s): date(many-to-one), doctor(one-to-one), patient(one-to-one) 
var appointmentSchema = Schema({
    valid: { type: Boolean, default: true }, // -->> the doctor overrides this 
    taken: { type: Boolean, default: false },

    //date_time: {}, 
    //take: { type: Date, default: Date.now, required: true }, ->> create 10 appointments per day 



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