const fs = require('fs')

const express = require('express')
const app = express()
const ip = "172.16.28.237"
const port = 3000


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
  let directories = fs.readdirSync('.\\Backend\\UserManagement')
  return JSON.stringify(directories)
}

//Calculate Profile Data - returns the Profile JSON File Path
function CalculateProfileData(userIdent)
{
  return '.\\Backend\\UserManagement\\' + userIdent + '\\Profile.json';
}

//Calculate Profile Data - returns the Profile JSON File Path
function CalculateProfileAvatar(userIdent)
{
  return '.\\Backend\\UserManagement\\' + userIdent + '\\Avatar.jpg';
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
  fs.writeFileSync(CalculateProfileData(userProfile.ident),JSON.stringify(userProfile));
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
    console.log(data[request.query.userProperty]);
    response.send(data[request.query.userProperty])
  })

//GET: /user
//Param: userID - Returns the Profile Avatar
app.get('/user/avatar', (request, response) => {
    console.log(request.query.userID);
    response.sendFile(CalculateProfileAvatar(request.query.userID))
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

  console.log(request);

  let ident = request.query.userID;
  let data = request.query.userProfile;
  data.ident = ident;
  UpdateProfile(data);
  response.Send("Profile updated!");

})

//POST: /user/property´
//Param: userID, userProperty, userValue
app.post('/user/property', (request, response) => {

  console.log(request);
 
  let ident = request.query.userID;
  let value = request.query.userValue;
  let field = request.query.userProperty;

  UpdateProfileField(ident, field, value);

  response.Send("Profile Field updated!");

})
