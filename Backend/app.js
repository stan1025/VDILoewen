/*
this example uses nodejs and express to build the server component
https://www.w3schools.com/nodejs/default.asp
https://expressjs.com/de/
*/
const fs = require('fs')


//include bodyParser to parse body of POST requests
const bodyParser = require('body-parser');
//include path to create plattform independent paths
const path = require('path');

const express = require('express')
const app = express()
const ip = "127.0.0.1"
const port = 3000

//parser for post requests
app.use(bodyParser.json());

//Use Function to disable CrossScripting Security Features
app.use(function(req, res, next) {
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



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Backend Component UserManagement

//GetProfiles - Establish the existing User Profile Folders inside UserManagement
function GetProfiles()
{
  let directories = fs.readdirSync(path.join(__dirname, './UserManagement'))
  return JSON.stringify(directories)
}

//Calculate Profile Data - returns the Profile JSON File Path
function CalculateProfileData(userIdent)
{
  return path.join(__dirname, './UserManagement/', userIdent, '/Profile.json');
}

//Calculate Profile Data - returns the Profile JSON File Path
function CalculateProfileAvatar(userIdent)
{
  return path.join(__dirname, './UserManagement/', userIdent, '/Avatar.jpg');
}

//GetProfile - returns the Profile JSON Object
function GetProfile(userIdent)
{  
  return JSON.parse(fs.readFileSync(CalculateProfileData(userIdent)))
}

//GetUser - returns the Profile JSON Object
function GetProfileProperty(userIdent, userProperty)
{  
  return JSON.parse(fs.readFileSync(CalculateProfileData(userIdent)))[userProperty]
}

//UpdateUser - update the Profile JSON Object to the JSON File
function UpdateProfile(userProfile)
{
  fs.writeFileSync(path.normalize(CalculateProfileData(userProfile.ident)),JSON.stringify(userProfile));
}

//UpdateProfileField - update single property of the profile
function UpdateProfileField(userIdent, userField, userValue)
{
  let userProfile = GetProfile(userIdent);
  userProfile[userField] = userValue;
  UpdateProfile(userProfile);
}

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

