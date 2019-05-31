var express = require("express");
var app = express();
var morgan = require('morgan');
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");

var index = require('./routes/index');

const dbLink = "mongodb+srv://shubham:shubham@cluster0-iolos.mongodb.net/pub?retryWrites=true";
// Mlab connectivity
mongoose.connect(dbLink, { useNewUrlParser: true}, function(err){
    if(err) {
        console.log('Some problem with the connection ' +err);
    } else {
        console.log('The Mongoose connection is ready');
    }
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use ((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/', index);

app.use((req, res, next) =>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});
module.exports = app;