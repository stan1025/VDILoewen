/*
this example uses nodejs and express to build the server component
https://www.w3schools.com/nodejs/default.asp
https://expressjs.com/de/
*/


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Call System Modules
const fs = require('fs')                      //FileSystem Handling
const _ = require('underscore')               //Property Handling
const bodyParser = require('body-parser');    //BodyParser to parse the Body of Post Messages
const path = require('path');                 //Path Handling, to create plattform independent paths
const nearbyCities = require('nearby-cities') //Nearby Cities Handling
const uuid = require('uuidv4');               //Generate Universal Unique Identifier

//REST Framework
const express = require('express')
const app = express()
const ip = "127.0.0.1"
const port = 3000

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Call External Modules

//GeoCoder to translate addresses to geo location data
const NodeGeocoder = require('node-geocoder');
const geooptions = {
  provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(geooptions);

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







//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Backend Component UserManagement

//GetProfiles - Establish the existing User Profile Folders inside UserManagement
function GetProfiles() {
  let directories = fs.readdirSync(path.join(__dirname, './UserManagement'))

  directories = directories.filter(source => fs.lstatSync(path.join(__dirname, './UserManagement', source)).isDirectory());

  console.log("Call: GetProfiles");
  console.log(directories);

  return directories
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

function GetCitiesNearbyAsync(userIdent, maxDistance, maxResults, minPopulation, callback) {
  console.log("Call: GetCitiesNearby");
  console.log("Incoming Data:")
  console.log("UserIdent: " + userIdent);

  var userProfile = GetProfile(userIdent);

  GetGeoLocationOfPrivateAddressAsync(userProfile, retGeoData => {
    const query = { latitude: retGeoData.latitude, longitude: retGeoData.longitude }
    var cityData = nearbyCities(query, maxResults, maxDistance);

    var filteredData = [];
    filteredData = cityData.filter(city => city.population >= minPopulation).sort(function (a, b) { return b.population - a.population }).slice(0, maxResults);

    console.log("Outgoing Data:")
    console.log(filteredData);
    callback(filteredData);
  });
}

function GetCompetenciesOfProfiles() {
  var filteredData = [];
  var profileList = GetProfiles();

  _.each(profileList, (userIdent, userkey, userlist) => {

    var competenciesData = GetProfileProperty(userIdent, "competencies")

    competenciesData.forEach((competency, compkey, complist) => {
      if (filteredData.indexOf(competency.name) == -1) {
        filteredData.push({ "name": competency.name, "group": competency.Group });
      }
    })
  })

  return filteredData;
}

function GetProfilesOfCompetence(competence, callback) {
  var filteredData = [];
  var foundProfiles = [];
  var profileList = GetProfiles();

  _.each(profileList, (userIdent, userkey, userlist) => {

    var competenciesData = GetProfileProperty(userIdent, "competencies")

    var competencyExist = false
    competenciesData.forEach((competency, compkey, complist) => {
      if (competency.name == competence || competence == 'all') {
        competencyExist = true;
      }
    })

    if(competencyExist)
    {
      foundProfiles.push(GetProfile(userIdent));
    }
  })

  GetGeoLocationOfPrivateAddressesAsync(foundProfiles, (data) => {

    foundProfiles.forEach((profile, profileNumber, profileList) => {
      foundProfiles[profileNumber].GeoData = data[profileNumber][0];
    }) 


    callback(foundProfiles);
  });

  return;
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//UserManagement API

//GET: /users - returns list of all profiles, Ident and Name
app.get('/users', (request, response) => {
  console.log(request);
  response.send(JSON.stringify(GetProfiles()))
})

//GET: /user
//Param: userID - Returns the Profile Data by Ident
app.get('/user/profile', (request, response) => {
  console.log(request.query.userID);
  let data = GetProfile(request.query.userID)
  console.log(data/*[request.query.userProperty]*/);
  response.send(data/*[request.query.userProperty]*/)
})

//GET: /user/profile/nearby
//Param: userID - Returns the biggest cities nearby the user private location
//Param: maxDistance - maximal distance from user in kilometer (optional, default is 20)
//Param: maxResults - maximal length of results of the biggest cities (optional, default is 5)
app.get('/user/profile/nearby', (request, response) => {
  console.log(request);

  var userID = request.query.userID ? request.query.userID : "GUID1";
  var maxDistance = request.query.maxDistance ? request.query.maxDistance : "20";
  var maxResults = request.query.maxResults ? request.query.maxResults : "5";

  GetCitiesNearbyAsync(userID, maxDistance, maxResults, "1", result => {
    response.send(result);
  });
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

function GetCouchResults(couchLocation) {
  var filteredData = [];
  let data = GetCouchData();

  _.each(data, function (value, key, list) {
    if (value.city == couchLocation) {
      filteredData.push({ ident: key, data: value, profile: GetProfileProperty(key, "private"), name: GetProfileProperty(key, "name") });
    }
  });

  return filteredData;
}

function GetCouchLocations() {
  var filteredData = [];
  let data = GetCouchData();

  _.each(data, function (value, key, list) {
    if (filteredData.indexOf(value.city) == -1) {
      filteredData.push(value.city);
    }

  });

  return filteredData;
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CouchSurfing API

//GET: /couches - returns list of all couches, Ident, Counts and City
app.get('/couches', (request, response) => {
  console.log(request);
  response.send(GetCouchData())
})

//GET: /couches/locations - returns list of all locations where couches are offered
app.get('/couches/locations', (request, response) => {
  console.log(request);
  response.send(GetCouchLocations())
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
  let location = request.params.location;

  let filteredData = GetCouchResults(location);

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
//Backend Component Practice@VDI Feautre
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Calculate Practice@VDI Data - returns the Practices JSON File Path
function CalculatePracticesData() {
  return path.join(__dirname, './Practices/Practices.json');
}

//GetPracticesData - returns the Practices JSON Object
function GetPracticesData() {
  return JSON.parse(fs.readFileSync(CalculatePracticesData()));
}

function GetPracticesDataAsArray() {
  var filteredData = [];
  let data = GetPracticesData();

  _.each(data, function (value, key, list) {
    filteredData.push({ ident: key, data: value, author: GetProfile(value.authorID) });
  });

  return filteredData;
}

//UpdatePracticesData - update the Practices JSON Object to the JSON File
function UpdatePracticesData(practiceData) {
  console.log("Debug Update Practices")
  console.log(practiceData);

  let filePath = path.normalize(CalculatePracticesData());
  console.log(filePath)
  fs.writeFileSync(filePath, JSON.stringify(practiceData));
}

//CreatePracticeEntry - Create a new Entry
function CreatePracticeEntry(practiceEntry) {
  console.log("Call: CreatePracticeEntry");
  console.log("Incoming Data:")
  console.log(practiceEntry);

  let data = GetPracticesData();
  data[uuid()] = practiceEntry;
  UpdatePracticesData(data);

  return data;
}

//UpdatePracticeEntry - Update an existing Entry
function UpdatePracticeEntry(practiceID, practiceEntry) {
  console.log("Call: UpdatePracticeEntry");
  console.log("Incoming Data:")
  console.log(practiceID);
  console.log(practiceEntry);

  let data = GetPracticesData();
  data[practiceID] = practiceEntry;
  UpdatePracticesData(data);
  return data;
}

//ClosePracticeEntry - Delete an existing Entry
function ClosePracticeEntry(practiceID) {
  console.log("Call: ClosePracticeEntry");
  console.log("Incoming Data:")
  console.log(practiceID);


  let data = GetPracticesData();

  console.log(data);
  delete data[practiceID];
  UpdatePracticesData(data);
}

function GetPracticeEntriesByRequestType(requestType) {
  console.log("Call: GetPracticeEntriesByRequestType");
  console.log("Incoming Data:")
  console.log(requestType);

  var filteredData = [];
  let data = GetPracticesData();

  _.each(data, function (value, key, list) {
    if (value.requestType == requestType) {
      filteredData.push({ ident: key, data: value, author: GetProfile(value.authorID) });
    }
  });

  console.log("Outgoing Data:")
  console.log(filteredData);

  return filteredData;
}

function GetPracticeEntriesByPracticeTypes(practiceType) {
  console.log("Call: GetPracticeEntriesByPracticeTypes");
  console.log("Incoming Data:")
  console.log(practiceType);

  var filteredData = [];
  let data = GetPracticesData();

  _.each(data, function (value, key, list) {
    if (value.practiceType == practiceType) {
      filteredData.push({ ident: key, data: value, author: GetProfile(value.authorID) });
    }
  });

  console.log("Outgoing Data:")
  console.log(filteredData);

  return filteredData;
}

function GetOwnPracticeEntries(requestType, authorID) {
  console.log("Call: GetOwnPracticeEntries");
  console.log("Incoming Data:")
  console.log(requestType);
  console.log(authorID);

  var filteredData = [];
  let data = GetPracticesData();

  _.each(data, function (value, key, list) {
    if (value.authorID == authorID && value.requestType == requestType) {
      filteredData.push({ ident: key, data: value });
    }
  });

  console.log("Outgoing Data:")
  console.log(filteredData);

  return filteredData;
}

//GetPracticesData - returns the Practices JSON Object
function GetPracticeEntry(practiceID) {
  return JSON.parse(fs.readFileSync(CalculatePracticesData()))[practiceID];
}

function GetPracticeResults(practiceID) {
  console.log("Call: GetPracticeResults");
  console.log("Incoming Data:")
  console.log(practiceID);


  var filteredData = [];
  let originEntry = GetPracticeEntry(practiceID);

  if (originEntry.requestType == "Offer") {
    let searchData = GetPracticeEntriesByRequestType("Search");
    //Origin Entry is an Offering -> match with Searchings

    _.each(searchData, function (value, key, list) {
      if (value.data.practiceType == originEntry.practiceType) {
        filteredData.push(value);
      }
    });

  }

  if (originEntry.requestType == "Search") {
    let offerData = GetPracticeEntriesByRequestType("Offer");
    // Origin Entry is an Searching -> match with Offerings

    _.each(offerData, function (value, key, list) {
      if (value.practiceType == originEntry.practiceType) {
        filteredData.push({ ident: key, matchEntry: value, matchProfile: GetProfile(value.authorID) });
      }
    });

  }

  console.log("Outgoing Data:")
  console.log(filteredData);

  return filteredData;
}

function GetOfferCompetenciesOfPractices() {
  var filteredData = [];
  var practiceList = GetPracticesDataAsArray();

  _.each(practiceList, (practice, userkey, userlist) => {


    if (practice.data.requestType == "Offer") {
      var competenciesData = practice.data.competencies;

      competenciesData.forEach((competency, compkey, complist) => {
        if (filteredData.indexOf(competency.name) == -1) {
          filteredData.push({ "name": competency.name, "group": competency.Group });
        }
      })
    }
  })

  return filteredData;
}

function GetRequestCompetenciesOfPractices() {
  var filteredData = [];
  var practiceList = GetPracticesDataAsArray();

  _.each(practiceList, (practice, userkey, userlist) => {


    if (practice.data.requestType == "Request") {
      var competenciesData = practice.data.competencies;

      competenciesData.forEach((competency, compkey, complist) => {
        if (filteredData.indexOf(competency.name) == -1) {
          filteredData.push({ "name": competency.name, "group": competency.Group });
        }
      })
    }
  })

  return filteredData;
}



function GetCompetenciesOfPractices() {
  var filteredData = [];
  var practiceList = GetPracticesDataAsArray();

  _.each(practiceList, (practice, userkey, userlist) => {

    var competenciesData = practice.data.competencies;

    competenciesData.forEach((competency, compkey, complist) => {
      if (filteredData.indexOf(competency.name) == -1) {
        filteredData.push({ "name": competency.name, "group": competency.Group });
      }
    })
  })

  return filteredData;
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Practice@VDI API
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//GET: /practices 
app.get('/practices', (request, response) => {
  console.log(request);
  response.send(GetPracticesDataAsArray())
})

//GET: /practices/requestType 
app.get('/practices/requestType', (request, response) => {
  console.log(request);

  let reqType = request.query.requestType;
  let data = GetPracticeEntriesByRequestType(reqType)

  response.send(data);
})

//GET: /practices/practiceType
app.get('/practices/practiceType', (request, response) => {
  console.log(request);

  let precType = request.query.practiceType;
  let data = GetPracticeEntriesByPracticeTypes(precType)

  response.send(data);
})

//GET: /practices/practiceType 
app.get('/practices/requestType/user', (request, response) => {
  console.log(request);

  let reqType = request.query.requestType;
  let authorID = request.query.userID;
  let data = GetOwnPracticeEntries(reqType, authorID)

  response.send(data);
})

//POST: /practices/create
app.post('/practices/create', (request, response) => {
  console.log(request);

  let userID = request.body.userID;
  let practiceData = request.body.practiceData;

  practiceData.authorID = userID;

  let data = CreatePracticeEntry(practiceData)

  response.send(data)
})

//POST: /practices/update
app.post('/practices/update', (request, response) => {
  console.log(request);

  let practiceID = request.body.practiceID;
  let practiceData = request.body.practiceData;

  let data = UpdatePracticeEntry(practiceID, practiceData)

  response.send(data)
})

//POST: /practices/close
app.post('/practices/close', (request, response) => {
  console.log(request);
  let practiceID = request.body.practiceID;

  ClosePracticeEntry(practiceID);

  response.send()
})



//GET: /practices/results
app.get('/practices/results', (request, response) => {
  console.log(request);
  let practiceID = request.query.practiceID;

  let data = GetPracticeResults(practiceID);

  response.send(data)
})




//GET: /practices/results
app.get('/practices/competencies', (request, response) => {
  console.log(request);


  let data = GetCompetenciesOfPractices();

  response.send(data)
})

//GET: /practices/results
app.get('/practices/competencies/request', (request, response) => {
  console.log(request);


  let data = GetRequestCompetenciesOfPractices();

  response.send(data)
})

//GET: /practices/results
app.get('/practices/competencies/offer', (request, response) => {
  console.log(request);


  let data = GetOfferCompetenciesOfPractices();

  response.send(data)
})





function GetGeoLocationOfPrivateAddressAsync(userProfile, callback) {
  console.log("Call GetGeoLocationOfPrivateAddress");
  console.log("Incoming Data:");
  console.log(userProfile);

  var requestingData = userProfile.private.street + " " + userProfile.private.number + ", " + userProfile.private.city;
  console.log("RequestingData: " + requestingData)

  geocoder.batchGeocode([requestingData], function (err, results) {
    console.log("Result Data:");
    console.log(results);
    callback(results[0].value[0]);
  });
}

function GetGeoLocationOfPrivateAddressesAsync(userProfiles, callback) {
  console.log("Call GetGeoLocationOfPrivateAddresses");
  console.log("Incoming Data:");
  console.log(userProfiles);

  var addressData = [];
  userProfiles.forEach(element => {
    addressData.push(element.private.street + " " + element.private.number + ", " + element.private.city);
  });

  console.log("Intermediate Data:");
  console.log(addressData);

  var resultData = [];
  geocoder.batchGeocode(addressData, function (err, results) {
    results.forEach(element => {
      resultData.push([element.value[0]]);
    })

    console.log("OutgoingData Data:");
    console.log(resultData);
    callback(resultData);
  });
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CompetenceMap API
//GET: /competenceLocations
//Param: competencies - returns the locations there mebers have this competencies
app.get('/competenceLocations', (request, response) => {

  console.log(request);
  var competenceFilter;

  if (request.query.hasOwnProperty('competencies')) {
    if (request.query.competencies == '') {
      competenceFilter = 'all'
    }
    else {
      competenceFilter = request.query.competencies;
    }
  }
  else {
    competenceFilter = 'all'
  }

  GetProfilesOfCompetence(competenceFilter, (result) => {
    console.log(result);
    response.send(result);
  })



})

app.get('/competenceMap/competencies/profiles', (request, response) => {
  console.log(request);
  response.send(GetCompetenciesOfProfiles());
})

