/*
this example uses nodejs and express to build the server component
https://www.w3schools.com/nodejs/default.asp
https://expressjs.com/de/
*/
const fs = require('fs')
const _ = require('underscore')

//include bodyParser to parse body of POST requests
const bodyParser = require('body-parser');
//include path to create plattform independent paths
const path = require('path');

//https://www.npmjs.com/package/node-geocoder
const NodeGeocoder = require('node-geocoder');
 
const geooptions = {
  provider: 'openstreetmap'
};
 
const geocoder = NodeGeocoder(geooptions);


const express = require('express')
const app = express()
const ip = "127.0.0.1"
const port = 3000

//parser for post requests
app.use(bodyParser.json());

//Use Function to disable CrossScripting Security Features
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Listen Function to bind the Server to a defined IP Address
app.listen(port, ip, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

//GET - Simple Test Message
app.get('/', (request, response) => {
  response.send('That\'s a VDI Prototyping Challenge Demo Server Example for developing coded Prototyps')
})


function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Backend Component UserManagement

//GetProfiles - Establish the existing User Profile Folders inside UserManagement
function GetProfiles() {
  let directories = fs.readdirSync(path.join(__dirname, './UserManagement'))
  return JSON.stringify(directories)
}

//Calculate Profile Data - returns the Profile JSON File Path
function CalculateProfileData(userIdent) {
  return path.join(__dirname, './UserManagement/', userIdent, '/Profile.json');
}

//Calculate Profile Data - returns the Profile JSON File Path
function CalculateProfileAvatar(userIdent) {
  return path.join(__dirname, './UserManagement/', userIdent, '/Avatar.jpg');
}

//GetProfile - returns the Profile JSON Object
function GetProfile(userIdent) {
  return JSON.parse(fs.readFileSync(CalculateProfileData(userIdent)))
}

//GetUser - returns the Profile JSON Object
function GetProfileProperty(userIdent, userProperty) {
  return JSON.parse(fs.readFileSync(CalculateProfileData(userIdent)))[userProperty]
}

//UpdateUser - update the Profile JSON Object to the JSON File
function UpdateProfile(userProfile) {
  fs.writeFileSync(path.normalize(CalculateProfileData(userProfile.ident)), JSON.stringify(userProfile));
}

//UpdateProfileField - update single property of the profile
function UpdateProfileField(userIdent, userField, userValue) {
  let userProfile = GetProfile(userIdent);
  userProfile[userField] = userValue;
  UpdateProfile(userProfile);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Backend Component CouchSurfing Feautre


//Calculate CouchSurfing Data - returns the CouchSurfing JSON File Path
function CalculateCouchData() {
  return path.join(__dirname, './CouchSurfing/Couch.json');
}

//GetCouchData - returns the Couch JSON Object
function GetCouchData() {
  return JSON.parse(fs.readFileSync(CalculateCouchData()));
}

//UpdateUser - update the Profile JSON Object to the JSON File
function UpdateCouchData(couchData) {
  fs.writeFileSync(path.normalize(CalculateCouchData()), JSON.stringify(couchData));
}

//GetCouchProperties - returns the Couch Profile JSON Object
function GetCouchProperties(userIdent) {
  return GetCouchData()[userIdent];
}

//SetCouchProperties - set the Couch Profile JSON Object
function SetCouchProperties(userIdent, userData) {
  let data = GetCouchData();
  data[userIdent] = userData;
  UpdateCouchData(data);
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//UserManagement API

//GET: /users - returns list of all profiles, Ident and Name
app.get('/users', (request, response) => {
  console.log(request);
  response.send(GetProfiles())
})

//GET: /user
//Param: userID - Returns the Profile Data by Ident
app.get('/user/profile', (request, response) => {
  console.log(request.query.userID);
  let data = GetProfile(request.query.userID)
  console.log(data/*[request.query.userProperty]*/);
  response.send(data/*[request.query.userProperty]*/)
})

//GET: /user
//Param: userID - Returns the Profile Avatar
app.get('/user/avatar', (request, response) => {
  console.log(request.query.userID);
  //convert binary data to base64 encoding before transmitting it via http
  response.send(fs.readFileSync(path.normalize(CalculateProfileAvatar(request.query.userID))).toString('base64'))
})

//GET: /user
//Param: userID - Returns the Profile Data by Ident
app.get('/user/property', (request, response) => {
  console.log(request.query.userID);
  let data = GetProfileProperty(request.query.userID, request.query.userProperty)
  response.send(data)
})

//GET: /user
//Param: userID - Returns the Profile Data by Ident
app.get('/user/profile/:userID', (request, response) => {
  console.log(request.params.userID);
  let data = GetProfile(request.params.userID)
  console.log(data);
  response.send(data)
})


//POST: /user/profile
//Param: userID, userProfile
app.post('/user/profile', (request, response) => {
  //body-parser delivers the body of the request as body substructure
  console.log(request.body);

  let ident = request.body.userID;
  let data = request.body.userProfile;
  data.ident = ident;
  UpdateProfile(data);
  response.send("Profile updated!");

})

//POST: /user/property´
//Param: userID, userProperty, userValue
app.post('/user/property', (request, response) => {
  //body-parser delivers the body of the request as body substructure
  console.log(request);

  let ident = request.body.userID;
  let value = request.body.userValue;
  let field = request.body.userProperty;

  UpdateProfileField(ident, field, value);

  response.Send("Profile Field updated!");

})



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CouchSurfing API

//GET: /couches - returns list of all couches, Ident, Counts and City
app.get('/couches', (request, response) => {
  console.log(request);
  response.send(GetCouchData())
})



//Get couchsurfing information from database 
app.get('/couch/:location', (request, response) => {
  console.log(request.params.location);
  let data = GetCouchData();
  let location = request.params.location;
  var filteredData = [];

  _.each(data, function (value, key, list) {
    if (value.city == location) {
      filteredData.push({ ident: key, data: value });
    }
  });

  console.log(filteredData);
  response.send(filteredData)
})

//Get full profile couchsurfing information from database 
app.get('/couch/:location/Profiles', (request, response) => {
  console.log(request.params.location);
  let data = GetCouchData();
  let location = request.params.location;
  var filteredData = [];

  _.each(data, function (value, key, list) {
    if (value.city == location) {
      filteredData.push({ ident: key, data: value, profile: GetProfileProperty(key, "private"), name: GetProfileProperty(key, "name") });
    }
  });


  console.log(filteredData);
  response.send(filteredData)
})

//GET: /user/couch
//Param: userID - Returns the couchsurfing information by Ident
app.get('/user/couch', (request, response) => {
  console.log(request);
  console.log(request.query.userID);
  let data = GetCouchProperties(request.query.userID);
  console.log(data);
  response.send(data)
})

//todo: update profile
app.post('/user/couch', (request, response) => {
  //body-parser delivers the body of the request as body substructure
  console.log(request.body);

  let ident = request.body.userID;
  let data = request.body.couchData;

  SetCouchProperties(ident, data);

  response.send("CouchData updated!");

})




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Practice@VDI API





//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//competencemap API
//GET: /competenceLocations
//Param: competencies - returns the locations there mebers have this competencies
app.get('/competenceLocations', (request, response) => {
  console.log(request);
  console.log(request.query.competencies);
  var data = [];
  if (request.query.competencies == 'C#')
  {
    geocoder.batchGeocode(['Kirchenstraße 23, Eggenstein-Leopoldshafen', 'Spöckweg 37a, Bruchsal'], function (err, results) {
      // Return an array of type {error: false, value: []}
      console.log(results) ;
      results.forEach(element => {
        console.log(element);
        data.push([element.value[0].latitude, element.value[0].longitude]);
      });

      console.log(data);
      response.send(data)
    });
    //data = geocoder.batchGeocode(['Kirchenstraße 23, Eggenstein-Leopoldshafen', 'Spöckweg 37a, Bruchsal']);
  }
  else
  {
    console.log(data);
    response.send(data)
  }
})



