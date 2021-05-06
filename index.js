let express = require("express");
let app = express();
let mongoose = require("mongoose");

// call the models 
//var carModel = require("./models/car")
let patientModel = require("./models/patient")
let doctorModel = require("./models/doctor")
let appointmentModel = require('./models/appointment')

//localhost:27017
const port = 27017;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // this line
app.use(express.json());
app.use(express.static('public')); // 

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
    Patient.findById(userId, (err, user) => done(err, user));
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
app.post('/patient', function (req, res) {

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


    // I have to find a way to save this 
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


// local strategy register, checks for existing username, otherwise saves username and password
app.get("/form", function (req, res) {
    res.render("pages/form");
});

/*
app.get("/garage", function (req, res) {
    carModel.listAllCars().then(function (cars) {
        res.render("pages/garage", { cars: cars });
    }).catch(function (error) {
        res.error("Something went wrong!" + error);
    });
})*/

/* // ERROR!
app.get("/patient", function (req, res) {
    patientModel.listAllPatients().then(function () {
        res.render("pages/patient", { patients: patients })
    }).catch(function (error) {
        res.error("Something went wrong!" + error);
    })
})*/

app.get("/appointment", function (req, res) {
    //patientModel.listAllAppointments().then(function (appointments) {
    res.render("pages/appointment")//, { appointments: appointments });
    //}).catch(function (error) {
    res.error("Something went wrong!" + error);
    //});
})


app.get("/patient", function (req, res) {
    patientModel.listAllPatients().then(function (patients) {
        res.render("pages/patient", { patients: patients });
    }).catch(function (error) {
        res.error("Something went wrong!" + error);
    });
})


app.get("/doctor", function (req, res) {
    doctorModel.listAllDoctors().then(function (doctors) {
        res.render("pages/doctor", { doctors: doctors });
    }).catch(function (error) {
        res.error("Something went wrong!" + error);
    });
})



app.get("/senior_patient", function (req, res) {
    // I get the query parameter from a POST request... 
    patientModel.patientAge(65).then(function (patients) {
        res.render("pages/patient", { patients: patients });

    }).catch(function (error) {
        res.error("Something went wrong!" + error);
    });
})



/*
const getDocument = async () => {
    try {
        var query = await patient
    } catch (err) {
        console.log(err)
    }
}*/

/*
let allPatient = await patientModel.find({});
console.log(allPatient);
app.get("/senior_patient", function (req, res) {
    patientModel.
})
*/

app.get("/appointment_form", function (req, res) { // for patients
    res.render("pages/appoinment_form.ejs");
})

app.get("/patient_form", function (req, res) {
    res.render("pages/patient_form.ejs");
})


app.get("/patient_custom_form", function (req, res) {
    res.render("pages/custom_query_patient.ejs")
})

app.get("/patient_urgent", function (req, res) {
    //res.send('new page!!!')
    res.render('pages/patient_urgent.ejs')
})

app.get("/patient_urgent_query_return", function (req, res) {
    console.log("You're getting this because ajax called me")
    console.log(JSON.stringify(req.query.urgent)) // pass the information here.... 

    //console.log(JSON.stringify(req.body.patient))
    //console.log(JSON.stringify(req.body.patient.age))
    //console.log(JSON.stringify(req.body.patient.first_name))
    //var age = 

    //var age = parseInt(JSON.stringify(req.body.patient.age))
    //console.log('input age: ', JSON.stringify(req.body.patient.age))
    //console.log('typeof age', typeof (JSON.stringify(req.body.patient.age)))

    //var age = parseInt(JSON.stringify(req.body.patient.age))
    //console.log('after into conv, ', age);
    //console.log('test parse:', typeof (parseInt("3")));

    //var age_ = parseInt(req.body.patient.age) // Q. Why input like this works? 
    //console.log('age_: ', age_)
    //console.log('typeof age_: ', typeof (age_))


    //patientModel.patientAge(age_).then(function (patients) {
    //    res.render("pages/patient", { patients: patients });

    //}).catch(function (error) {
    //    res.err("Something went wrong!" + error);
    //console.log('error')
    //});
    //console.log('' q.length);
})



app.get("/doctor_form", function (req, res) {
    res.render("pages/doctor_form.ejs");
})


app.get("/", function (req, res) {
    //res.send('no more hellos, please!')
    console.log(`GET (/) request at ${Date.now}`)
    res.render("pages/appointments.ejs");
});


app.post('/car', function (req, res) {
    console.log("Car: " + JSON.stringify(req.body.car));
    var newCar = new carModel(req.body.car);

    newCar.save().then(function () {
        //res.send("Added new car to database!");
    }).catch(function (err) {
        res.err("Failed to add new car to database!");
    });
});

/*
// post patient: .save - .then() is part of the promise notation
app.post('/patient', function (req, res) {
    console.log("Patient: " + JSON.stringify(req.body.patient)); // how we get data from client
    var newPatient = new patientModel(req.body.patient); // 

    // run the query here??? 

    // do query - do callback.. 

    newPatient.save().then(function () { // 1. Inform successful db entry 2. Redirect to patient page
        // Use res.redirect
        res.redirect("/patient")
        //res.send("pages/patient", { patients: patients });
        //res.render("pages/patient", { patients: patients });
    }).catch(function (err) {
        res.err("Failed to add new patient to database!");
    })
})
*/
app.post('doctor', function (req, res) {
    console.log("Doctor: " + JSON.stringify(req.body.doctor));
    var newDoctor = new doctorModel(req.body.doctor);

    newDoctor.save().then(function () {
        res.redirect("/doctor")
    }).catch(function (err) {
        res.err("Failed to add new patient to db!")
    })
})



app.post('/custom_query_patient', function (req, res) {
    console.log(JSON.stringify(req.body))
    console.log(JSON.stringify(req.body.patient))
    console.log(JSON.stringify(req.body.patient.age))
    console.log(JSON.stringify(req.body.patient.first_name))
    //var age = 

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

app.post('/patient_urgent', function (req, res) { //4/17/2021
    console.log(JSON.stringify(req.body))
    //console.log(JSON.stringify(req.body.patient))
    //console.log(JSON.stringify(req.body.patient.age))
    //console.log(JSON.stringify(req.body.patient.first_name))
    //var age = 

    //var age = parseInt(JSON.stringify(req.body.patient.age))
    //console.log('input age: ', JSON.stringify(req.body.patient.age))
    //console.log('typeof age', typeof (JSON.stringify(req.body.patient.age)))

    //var age = parseInt(JSON.stringify(req.body.patient.age))
    //console.log('after into conv, ', age);
    //console.log('test parse:', typeof (parseInt("3")));

    //var age_ = parseInt(req.body.patient.age) // Q. Why input like this works? 
    //console.log('age_: ', age_)
    //console.log('typeof age_: ', typeof (age_))


    patientModel.patientIsUrgent().then(function (patients) {
        res.render("pages/patient", { patients: patients });

        //Instead of rendering new page, I will return the query output


    }).catch(function (error) {
        res.err("Something went wrong!" + error);
        console.log('error')
    });
    //console.log('' q.length);
})




// post doctor
app.post('/doctor', function (req, res) {
    console.log("Doctor: " + JSON.stringify(req.body.doctor));
    var newDoctor = new doctorModel(req.body.doctor); // Q. What is this doing? 

    newDoctor.save().then(function () {
        res.send("Added new doctor to database!");
    }).catch(function (err) {
        res.err("Failed to add new doctor to database!");
    });
});


//app.get
app.listen(port, function () {
    console.log("App listening on port " + port + "!");
});