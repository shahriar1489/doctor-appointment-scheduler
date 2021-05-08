let express = require("express");
let app = express();
let mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // this line
app.use(express.json());
app.use(express.static('public')); // 


// call the models 
let patientModel = require("../models/patient");

// Set up default mongoose connection 
var mongoDB = 'mongodb://127.0.0.1/new_database';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection 
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
    Patient.findById(userId, (err, user) => {
        console.log('In callback for Patient deserialization')

        // check here...? 
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

    var username = req.body.patient.username;
    var password = req.body.patient.password;
    //const password = req.body.patient.password;

    console.log('first_name: ' + first_name);
    console.log('last_name: ' + last_name);
    console.log('username: ' + username);
    console.log('blood: ' + blood_group);
    console.log('age: ' + age)


    //console.log("Doctor: " + JSON.stringify(req.body.doctor));
    //var newDoctor = new doctorModel(req.body.doctor); // Q. What is this doing? 

    //var newPatient = new patientModel(req.body.patient); // with the password 
    /* 
    The line above was good to create patient without verification. But since we are using password 
    and (unique) username, we now use a different way to save 
    */
    //SR: Below, we pass a tuple of all the 

    patientModel.create({
        username: username, password: password,
        first_name: first_name, last_name: last_name,
        blood_group: blood_group, age: age
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

// login, username and password are extracted from the post request
app.post("/patient_login",
    passport.authenticate("local", { // 
        successRedirect: "/",
        failureRedirect: "/patient_login"
    })
);

app.get("/patient_login", function (req, res) {
    res.render("pages/patient_login");
});

app.get("/get_appointment", function (req, res) {
    //patientModel.listAllAppointments().then(function (appointments) {
    res.render("pages/appointment")//, { appointments: appointments });
    //}).catch(function (error) {
    res.error("Something went wrong!" + error);
    //});
})