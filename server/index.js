require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const ac = require("./controllers/authController");
const treasureCtrl = require('./controllers/treasureController');
const auth = require("./middleware/authMiddleware.js");

const { SESSION_SECRET, CONNECTION_STRING } = process.env;

const app = express();

const PORT = 4000;

app.use(express.json());

massive(CONNECTION_STRING).then(dbInstance => {
    app.set('db', dbInstance);
    console.log("db connected");
    
});

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
);

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);
app.get('/auth/logout', ac.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly,treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`)); 