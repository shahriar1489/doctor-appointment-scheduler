let express = require("express");
let app = express();
let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');
// const checkLogin = require("./middlewares/checkLogin");
let connectEnsureLogin = require('connect-ensure-login');

// call the models 
let patientModel = require("./models/patient")
let appointmentModel = require('./models/appointment')

const port = 27017;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // this line
app.use(express.json());
app.use(express.static('public')); // 

// body parser and express-session package installation
let bodyParser = require('body-parser');
let expressSession = require('express-session')({
    secret: 'secret',
    resave: false, // The resave field forces the session to be saved back to the session store
    saveUninitialized: false //the saveUninitialized field forces a session that is “uninitialized” to be saved to the store
});
app.use(expressSession);
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


// Set up default mongoose connection 
var mongoDB = 'mongodb://127.0.0.1/new_database';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection 
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//patientModel.plugin(passportLocalMongoose); //

// Authentication code is below 

/* setup a session */
var session = require('express-session');
var FileStore = require('session-file-store')(session); // allows to store the file on client device...? 

app.use(session({
    name: 'server-session-cookie-id',
    secret: 'my express secret <usually keyboard cat>',
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
}));

/* initialize passport */
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

/* convert user object into id that is saved in the session */
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

/* takes userId from session and loads whole user object from the database */
passport.deserializeUser(function (userId, done) {
    var patientFound = false;
    // Search patient,
    patientModel.findById(userId, (err, user) => {
        console.log('In callback for Patient deserialization')
        done(err, user)
    });
});

// setup "local" playin username / password strategy  
const LocalStrategy = require("passport-local").Strategy;
const local = new LocalStrategy((username, password, done) => {
    //lookup user in database, and check the provided password
    patientModel.findOne({ username })
        .then(user => {
            if (!user || !user.validPassword(password)) {
                done(null, false, { message: "Invalid username/password" });
            } else {
                done(null, user);
            }
        })
        .catch(e => done(e));
    //lookup patient (by ID) in database, and check the provided password 
    /*
   
    */
});

passport.use("local", local);
// copy the code above to patient.js in routes 


const slots = ['17:00-17:25', '17:35-18:00', '18:10-18:35', '18:45-19:10', '19:20-19:45']

// local strategy register, checks for existing username, otherwise saves username and password
app.post('/patient', function (req, res) { // for patient registration

    // Take all the patient information first 
    var username = req.body.patient.username;
    var password = req.body.patient.password;
    //const password = req.body.patient.password;

    var first_name = req.body.patient.first_name;
    var last_name = req.body.patient.last_name;

    var blood_group = req.body.patient.blood_group;
    var age = req.body.patient.age;

    //const password = req.body.patient.password;

    console.log('first_name: ' + first_name);
    console.log('last_name: ' + last_name);
    console.log('username: ' + username);
    console.log('blood: ' + blood_group);
    console.log('age: ' + age);

    //console.log("Doctor: " + JSON.stringify(req.body.doctor));
    //var newDoctor = new doctorModel(req.body.doctor); // Q. What is this doing? 

    //var newPatient = new patientModel(req.body.patient); // with the password 

    //The line above was good to create patient without verification. But since we are using password 
    //and (unique) username, we now use a different way to save 

    //SR: Below, we pass a tuple of all the 

    patientModel.create({
        username: username, password: password,
        first_name: first_name, last_name: last_name,
        blood_group: blood_group, age: age,
        role: 'patient'
    }).then(user => { // I need to pass the created model. What will it be? 
        console.log("Registered patient: " + username);
        req.login(user, err => {
            if (err) next(err);
            else res.redirect("/");
        });
    }).catch(err => {
        if (err.name === "ValidationError") {
            console.log("Sorry, that username for is already taken.");
            res.redirect("/");
        } else next(err);
    });


});

app.get("/doctor_form", function (req, res) {
    res.render("pages/doctor_form.ejs");
});

app.get("/doctor_login", function (req, res) {
    res.render("pages/patient_login");
});

// login, username and password are extracted from the post request
app.post("/doctor_login",
    passport.authenticate("local", { // 
        successRedirect: "/",
        failureRedirect: "/doctor_login", // GET

    })
);

app.get("/doctor", function (req, res) {

    patientModel.listAllDoctors().then(function (doctors) {
        res.render("pages/doctor", { doctors: doctors });
    }).catch(function (error) {
        res.error("Something went wrong!" + error);
    });

    /*    
        var firoz;
    
        // query to get Dr. Firoz using statics 
        patientModel.getDrFiroz().then(function (doctors) {
            firoz = doctors;
            //console.log('In static function.\n' + firoz);
            console.log('firoz.username :' + doctors[0].username);
            res.render("pages/doctor", { doctors: doctors });
        }).catch(function (error) {
            res.error("Something went wrong!" + error);
        });
    
        console.log('Outside static function: ' + firoz);
    */


    //var firoz = patientModel.findOne({ username: 'firoz@gmail.com' });




    // query using model and callback 
    // using callback
    /*
        Adventure.findOne({ country: 'Croatia' }, function (err, adventure) {
    
        });
    
        // using async/await 
        async function requestWithRetry(url) {
            const MAX_RETRIES = 10;
            for (let i = 0; i <= MAX_RETRIES; i++) {
                try {
                    return await request(url);
                } catch (err) {
                    const timeout = Math.pow(2, i);
                    console.log('Waiting', timeout, 'ms');
                    await wait(timeout);
                    console.log('Retrying', err.message, i);
                }
            }
        }
    */
    /* var firoz = async function getDrFiroz() {
         console.log('inside aync function');
         return await patientModel.findOne({ username: 'firoz@gmail.com' }).exec();
 
     }*/

    /*
        patientModel.listAllDoctors().then(function (doctors) {
            res.render("pages/doctor", { doctors: doctors });
        }).catch(function (error) {
            res.error("Something went wrong!" + error);
        });
    */

});

// local strategy register, checks for existing username, otherwise saves username and password
app.post('/doctor', function (req, res) { // for patient registration
    // Take all the patient information first 
    var username = req.body.doctor.username;
    var password = req.body.doctor.password;
    //const password = req.body.patient.password;

    var first_name = req.body.doctor.first_name;
    var last_name = req.body.doctor.last_name;

    var specialization = req.body.doctor.specialization;
    var qualification = req.body.doctor.qualification;


    // age and blood_group are not relevant for doctors, so- we address it here
    var blood_group = 'B+';
    var age = 35;

    console.log('first_name: ' + first_name);
    console.log('last_name: ' + last_name);
    console.log('username: ' + username);
    console.log('qualification: ' + qualification);
    console.log('specialization: ' + specialization);

    patientModel.create({
        username: username, password: password,
        first_name: first_name, last_name: last_name,
        blood_group: blood_group, age: age,
        role: 'doctor', specialization: specialization,
        qualification: qualification,
    }).then(user => { // I need to pass the created model. What will it be? 
        console.log("Registered doctor: " + username);
        req.login(user, err => {
            if (err) next(err);
            else res.redirect("/");
        });
    }).catch(err => {
        if (err.name === "ValidationError") {
            console.log("Sorry, that username for is already taken.");
            res.redirect("/");
        } else next(err);
    });
});

app.get("/patient_login", function (req, res) {
    res.render("pages/patient_login");
});

// login, username and password are extracted from the post request
app.post("/patient_login",
    passport.authenticate("local", { // 
        successRedirect: "/",
        failureRedirect: "/patient_login",

    })
);

app.get("/patient", function (req, res) {
    patientModel.listAllPatients().then(function (patients) {
        res.render("pages/patient", { patients: patients });
    }).catch(function (error) {
        res.error("Something went wrong!" + error);
    });
});

app.get('/set_appointment', function (req, res) {
    res.render("pages/set_appointment");
});


// set_appointment is for doctors only 
app.post('/set_appointment', connectEnsureLogin.ensureLoggedIn('/doctor_login'), async function (req, res, next) {
    // Need Doctor information
    //    console.log('\t\tUser: ' + req.user._id);

    const tomorrow = new Date();
    // add 1 day to today
    tomorrow.setDate(new Date().getDate() + 1);
    //console.log(tomorrow);

    // at this point, I have tomorrow's date 

    // valid, taken, slot, patient, doctor, note
    // foreign key: patient, doctor, comments 
    var slot = JSON.stringify(req.body); // req.body.slot does not return anything
    var doctor = JSON.stringify(req.user._id);
    var datetime = tomorrow.toDateString() + ' ' + slot;
    var date = tomorrow;

    //console.log('slot: ' + slot);
    //console.log('slot type: ' + typeof (slot));

    //console.log('datetime: ' + datetime);
    //console.log('datetime type: ' + typeof (datetime));

    // console.log('tomorrow: ' + tomorrow);

    console.log('doctor id :' + doctor);
    console.log('typeof doctor id: ' + typeof (doctor))
    //datetime (pk) , date, valid, taken, patient, doctor, note, comments

    var new_appointment = new appointmentModel({
        date: tomorrow, datetime: datetime,
        valid: true, taken: false,
        slot: slot,
        doctor: req.user._id,

    });

    try {
        const appointment = await new_appointment.save();
        await patientModel.updateOne({
            _id: req.user._id
        }, {
            $push: {
                appointments: appointment._id
            }
        });

        res.status(200).json({
            message: "Appointment was inserted successfully to Patient documnet!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }

    /*
    appointmentModel.create({
        date: tomorrow, datetime: datetime,
        valid: true, taken: false,
        slot: slot,
        doctor: req.user._id,
    }).then(user => { // I need to pass the created model. What will it be? 
        console.log("Registered appointment: " + user);
    
        req.login(user, err => {
            if (err) next(err);
            else res.redirect("/");
        });
    }).catch(err => {
        if (err.name === "ValidationError") {
            console.log("Sorry, that datetime for is already taken.");
            res.redirect("/");
        } else next(err);
    });
    */
});

app.get('/make_appointments', connectEnsureLogin.ensureLoggedIn('/patient_login'), function (req, res, next) {
    // WORKS: work in progress
    // redirect to this route after patient login
    // will show doctors in link tag 
    /*
        Things I want here: 
        1. Available Appointment Slots 
        2. Doctor Name- from using populate. NOT _id 
    */
    //  var user = req.user._id; // appointment id 
    appointmentModel.find({}) // try to put sth some value here 
        .populate("patient")
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    result: data,
                    message: "Success",
                });
            }
        });

    //populate-path-patient
    //and then 
    //populate-path-appointment 

    // I want to populate the Patient model with multiple Appointment ID 
});


//app.get('/make_appointments', function (req, res, next) { // WORKS: work in progress
// redirect to this route after patient login
// will show doctors in link tag 
/*
    Things I want here: 
    1. Available Appointment Slots 
    2. Doctor Name- from using populate. NOT _id 
*/
/*
    appointmentModel.find({}) // try to put sth some value here 
        .populate({
            path: 'patient',
            populate: { path: 'appointments' }
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    result: data,
                    message: "Success",
                });
            }
        });

});
*/

app.get("/senior_patient", function (req, res) {
    // I get the query parameter from a POST request... 
    /*
    patientSchema.statics.patientEmail = function (email) { // 4/17/2021 
        // custom query goes here: for urgent=true 
        return this.find({ email: { email });
    }*/

    var email = null;
    patientModel.patientEmail(email).then(function (patients) {
        res.render("pages/patient", { patients: patients });

    }).catch(function (error) {
        res.error("Something went wrong!" + error);
    });


    patientModel.patientAge(65).then(function (patients) {
        res.render("pages/patient", { patients: patients });

    }).catch(function (error) {
        res.error("Something went wrong!" + error);
    });
})
/*
app.get("/appointment_form", function (req, res) { // for patients
    res.render("pages/appoinment_form.ejs");
})
*/
app.get("/patient_form", function (req, res) {
    res.render("pages/patient_form.ejs");
})



/*
app.get("/patient_custom_form", function (req, res) {
    res.render("pages/custom_query_patient.ejs")
})

app.get("/patient_urgent", function (req, res) {
    //res.send('new page!!!')
    res.render('pages/patient_urgent.ejs')
})
*/
app.get("/patient_urgent_query_return", function (req, res) {
    console.log("You're getting this because ajax called me")
    console.log(JSON.stringify(req.query.urgent)) // pass the information here.... 

    res.send('You are not using this route');
})

app.get("/", function (req, res) {
    res.render("pages/appointments.ejs");
});

app.post('/custom_query_patient', function (req, res) {

    console.log(JSON.stringify(req.body))
    console.log(JSON.stringify(req.body.patient))
    console.log(JSON.stringify(req.body.patient.age))
    console.log(JSON.stringify(req.body.patient.first_name))

    var age = parseInt(JSON.stringify(req.body.patient.age))
    //console.log('input age: ', JSON.stringify(req.body.patient.age))
    //console.log('typeof age', typeof (JSON.stringify(req.body.patient.age)))

    //var age = parseInt(JSON.stringify(req.body.patient.age))
    //console.log('after into conv, ', age);
    //console.log('test parse:', typeof (parseInt("3")));

    var age_ = parseInt(req.body.patient.age) // Q. Why input like this works? 
    console.log('age_: ', age_)
    console.log('typeof age_: ', typeof (age_))


    patientModel.patientAge(age_).then(function (patients) {
        res.render("pages/patient", { patients: patients });

    }).catch(function (error) {
        res.err("Something went wrong!" + error);
        //console.log('error')
    });
    //console.log('' q.length);
})
/*
app.get('/private',
    connectEnsureLogin.ensureLoggedIn('/patient_login'),
    (req, res) => {

        res.send(req.user);
    }//res.sendFile('html/private.html', { root: __dirname })
);
*/
//app.get
app.listen(port, function () {
    console.log("App listening on port " + port + "!");
});

