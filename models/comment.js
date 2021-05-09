let mongoose = require('mongoose'), Schema = mongoose.Schema;
let Appointment = require("./appointment")
let Doctor = require("./doctor")

var commentSchema = Schema({
    comment: { type: String, required: true },
    //timestamp: {} add timestamp soon!

    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
    }, // one appoitment
    doctor: {
        type: Schema.Types.ObjectId, ref: 'Patient'
    }, // one doctor 

});

commentSchema.statics.listAllComments = function () {
    return this.find({});
};

//appointmentSchema.statics.


var commentModel = mongoose.model('comment', commentSchema);
module.exports = commentModel;