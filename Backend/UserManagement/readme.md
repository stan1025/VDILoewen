# Documentation of the User Management 

## Following Requests are implemented:

GET:    "/users"
-> returns list of the user IDs

GET:    "/user/profile"
Param:  userID: User Identificator
-> returns the profile as json object

GET:    "/user/avatar"
Param: userID: User Identificator
-> returns the profile picture

GET:    "/user/property"
Param: userID: User Identificator
Param: userProperty: requested Profile Property
-> returns the profile property 


POST:   "/user/profile"
Param: userID: User Identificator
Param: userProfile: Profile Data
-> Updates the Profile Data

POST:   "/user/property"
Param: userID: User Identificator
Param: userProperty: Profile Property
Param: userValue: Profile Value for the Property
-> Updates the selected Profile PRoperty

