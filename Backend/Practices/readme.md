# Documentation of the CouchSurfing API 

## Following Type Definitions are implemented:

Following PracticeTypes are possible:
- FulltimeJob
- ParttimeJob
- Freelancer
- StudentJob
- Internship
- FinalExam
- Others

Following RequestTypes are possible:
- Offer
- Search


## Following Requests are implemented:

### Administrative Requests

GET:    "/practices"
-> Returns all the Practices Entries

GET:    "/practices/practiceType"
Param:  practiceType: requested Practice Type
-> Returns all the Practices Entries of the defined Type

GET:    "/practices/requestType"
Param:  requestType: requested Request Type
-> Returns all the Practices Entries of the defined Type



### User Requestes

GET: "/practices/requestType/user"
Param:  requestType: requested Request Type
Param: UserID: User Identificator
-> returns all the entries of this user


POST:   "/practices/create"
Param:  userID: User Identificator 
Param:  practiceData: Dataset of the User Request
-> Create a new User Entry

POST:   "/practices/update"
Param:  practiceID: Prectice Identificator 
Param:  practiceData: Dataset of the User Request
-> Update a new User Entry

POST:   "/practices/close"
Param:  practiceID: Practice Entry ID who should be closed
-> Close the entry

GET:    "/practices/results"
Param: practiceID: Practices Entry ID
-> Returns a list of matching elements