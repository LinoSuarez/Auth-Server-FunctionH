var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

app.use(bodyParser.json())

// app.use(bodyParser({limit: '900mb'}));
var PORT = 3000;
var IP = '0.0.0.0';
var fs = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
 host: 'localhost',
 user: 'root',
 password: 'ls5109',
 database: 'FunctionH'
});

// Call on this function to add new user in mysql 
queryGetAppointments = (data, callback) => {
	console.log(data);
	connection.query(
	'SELECT id, appointmentTime, appointmentReason, adminName, clientName FROM Appointments WHERE clientName = ?', [data.username], function(err, results){
		if(results!= ""){
			callback(results)
		} else {
			callback(false)
		}
	}
	)
}

queryGetAppointmentsAdmin = (data, callback) => {
	console.log(data);
	connection.query(
	'SELECT id, appointmentTime, appointmentReason, adminName, clientName FROM Appointments ORDER BY appointmentTime', function(err, results){
		if(results!= ""){
			callback(results)
		} else {
			callback(false)
		}
	}
	)
}

queryCreateUser = (newUser, callback) => {

var username = newUser.username
var password = newUser.password
var fullname = newUser.fullname
var email = newUser.email
var phone = newUser.phone
var address = newUser.address
var city = newUser.city
var zipands = newUser.zipands


connection.query(
	'INSERT INTO Users (username, password, fullName, email, phone, address, city, zipands) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [username, password, fullname, email, phone, address, city, zipands], function(err, results) {

		if (results != "") {
			console.log(username, 'registered')
			callback(true)
		} else {
			callback(false)
		}

	}
)
}

// Method to set image in database

querySetImage = (image, username, callback) => {

	connection.query(
		'UPDATE Users SET profilePicture = ? WHERE username = ?', ['data:image/png;base64,' + image, username], function(err, results){
			if(results!=""){
				callback(true)
			} else {
				callback(false);
			}

	})
}

queryCancelAppointment = (id, callback) => {
	// console.log(id, "IDDDD")
	connection.query(
		'DELETE FROM Appointments WHERE id=?', [id.id], function(err, results){
			// console.log(results, 'hey')
			if(results!=""){
				
				callback(true)
			} else {
				callback(false);
			}

	})
}


queryGetImage = (username, callback) => {
	connection.query(
		'SELECT profilePicture FROM Users WHERE username = ?', [username], function(err,results) {
			try {
				// console.log(results)
				if(results[0].profilePicture){
					console.log("yes")
					callback(results[0].profilePicture)
					
				} else {
					callback(false)
	
				}
			} catch(err){
				console.log(err)
			}
		}

	)

}
// To get user details to populate user profile page
queryNewAppointment = (newAppointment, callback) => {
console.log(newAppointment)
	var adminName = "Admin"
	var clientName = newAppointment.userName
	var appointmentReason = newAppointment.reason
	var appointmentTime = new Date(newAppointment.chosenDate)
	// console.log(appointmentTime, 'appTime')
connection.query(
	
	'INSERT INTO Appointments (adminName, clientName, appointmentReason, appointmentTime) VALUES (?, ?, ?, ?)', [adminName, clientName, appointmentReason, appointmentTime],
	 function(err, results) {
		console.log(err, results, "appoint")
		if (results != "") {
			console.log(clientName, 'Booked a new appointment')
			callback(true)
		} else {
			callback(false)
		}

	}
)
}
queryUserDetails = (data, callback) => {
	
	connection.query(
	'SELECT fullName, email, phone, address, city, zipands FROM Users WHERE username = ?', [data.username], function(err, results){
		if(results!= ""){
			callback(results[0])
		} else {
			callback(false)
		}
	}
	)
}

queryLogin = (username, password, callback) => {
	console.log(username, password)

connection.query(
 'SELECT username FROM Users WHERE username = ? AND password = ?',
 [username, password],
 function(err, results) {
	// callback(results)
	if (results != ""){ 
		console.log(username, 'logged in')
		insertToken(username)
		callback(true)

	} else {
		console.log(username, 'attempted login')
		callback(false)
	}
 }
);
}

insertToken = (username) => {

	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i=0; i<24; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	connection.query(
		'UPDATE Users SET token = ? WHERE username = ?', [randomstring, username]
	)
}
app.post("/login", function(req, res) {
	queryLogin(req.body.username, req.body.password, (json) => {
		res.json(json)
	})

});
app.post("/setImage", function(req, res) {
	
	var userName = req.body.username
	var image = req.body.image
	console.log(userName, 'set image')
	querySetImage(image, userName, (json) => {
		res.json(json)
	})


});

app.post("/getImage", function(req, res){
	console.log('Image requested', req.body.username)
	queryGetImage(req.body.username, (image) => {
		if (image === false){
			res.send(false)
		} else {
			res.contentType('image/png');
			res.end(image);
		}

	})
})


app.post("/getUser", function(req, res){
	queryUserDetails(req.body, (json) => {
		
		res.json(json)
	})

})

app.post("/register", function(req, res){
 
	queryCreateUser(req.body, (json) => {
		res.json(json)
	})

})
app.post("/newAppointment", function(req, res){
	console.log(req.body)
	queryNewAppointment(req.body, (json) => {
		res.json(json)
	})
})
app.get('/test', function(req, res) {
	res.status(200).send('ok')
  });

app.post("/getAppointments", function(req, res){
	queryGetAppointments(req.body, (json) => {
		
		res.json(json)
	})

})

app.post("/cancelAppointment", function(req, res){
	queryCancelAppointment(req.body, (json) => {
		
		res.json(json)
	})

})

app.post("/getAppointmentsAdmin", function(req, res){
	queryGetAppointmentsAdmin(req.body, (json) => {
		
		res.json(json)
	})

})

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});