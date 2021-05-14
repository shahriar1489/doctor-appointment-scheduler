let mongoose = require('mongoose'), Schema = mongoose.Schema;

//let Patient = require("./patient");
//let Comment = require("./comment");

//console.log(Patient);

// Appointment -> id, time, foreign key(s): date(many-to-one), doctor(one-to-one), patient(one-to-one) 
var appointmentSchema = Schema({

    datetime: { type: String, unique: true, },

    //datetime: { type: String, required: true, unique: true, },

    date: { type: Date, }, // not unique 


    valid: { type: Boolean, default: true }, // -->> the doctor overrides this 
    taken: { type: Boolean, default: false },
    slot: { type: String, }, //required: true, enum: [{ "slot`": "17:00-17:25" }, { "slot`": "17:35-18:00" }, { "slot`": "18:10-18:35" }, { "slot`": "18:45-19:10" }, { "slot`": "19:20-19:45" }] },

    //patient: { type: Schema.Types.ObjectId, ref: 'Patient' }, // one patient 
    doctor: { type: Schema.Types.ObjectId, ref: 'Patient' }, // one doctor 
    //19:20-19:45
    //note: { type: String, trim: true, },

    //comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
    // day // Monday to Saturday... (should work as foreign key) -->> many appointment - one day
});

appointmentSchema.statics.listAllAppointments = function () {
    return this.find({});
};

//appointmentSchema.statics.


var appointmentModel = mongoose.model('appointment', appointmentSchema);
module.exports = appointmentModel;