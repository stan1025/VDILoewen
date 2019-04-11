# Documentation of the CouchSurfing API 

## Following Requests are implemented:

GET:    "/couches"
-> Returns all the Couch Surfing Entries

GET:    "/couch/:location"
-> Returns all entries for the given locations without the profiles

GET:    "/couch/:location/Profiles"
-> Returns all entries for the given location with details profile information
-> Update: returns additionally the name of the person.
***Attention: for this feature, a new profile data structure is defined, see GUID1/profile.json***

GET:    "/user/couch" 
Param:  userID: User Identificator
-> Returns the current settings of the CouchSurfing Data from the defined user

POST:   "/user/couch"
Param:  userID: User Identificator
-> Updates the current settings of the CouchSurfing Data from the defined user



