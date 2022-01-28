const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://naren1987:Naren2022$@cluster0.w07w8.mongodb.net/customer?retryWrites=true&w=majority";
const DATABASE_NAME = "customer";
const TOKEN = "abc123!@#$";


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("personal");
        console.log("Connected to `" + DATABASE_NAME + "`DB!");
    });
});

//Post Email 
app.post("/postEmail", (request, response) => {
    collection.insert(request.body, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send("Record(s) inserted successfully!.");
    });
});

//Get Email
app.get("/api/v1/email", (request, response) => {
    console.log(request.headers['token']);
    console.log(request.query.limit);
    console.log(request.query.offset);
    if (request.headers['token'] !== TOKEN) {
        return response.status(401).send("invalid token");
    }
    collection.find().sort({ _id: 1 }).limit(Number(request.query.limit)).skip(Number(request.query.offset)).toArray((error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});