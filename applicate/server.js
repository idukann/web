var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 6060;

var passport = require('passport');
var flash = require('connect-flash');

require('./config/passport')(passport);
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "nodejs_login"
});

con.connect(function(err) {
  if (err) throw err
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials" , true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
   next();
  });
  app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.route('/api/cats').get((req, res) => {
    console.log('inside method');
    res.send({
      cats: [{ name: 'lilly' }, { name: 'lucy' }]
    });
  });

  app.route('/api/cats/:name').get((req, res) => {
    const requestedCatName = req.params['name'];
    res.send({ name: requestedCatName });
    
});


app.route('/api/cats2').post((req, res) => {
    const postBody = req.body;
        var sql = "INSERT INTO users (fname, lname,address,username,password,gender,type) VALUES ('" +postBody.fname +"','" +postBody.lname +"','" +postBody.address +"','" +postBody.username+"','" +postBody.password+"','" +postBody.gender +"','user')";

        console.log(sql);
        con.query(sql, function (err, result) {
          console.log("1 record inserted");
      });
    
  res.send(201, req.body);
});


app.route('/api/cats1').post((req, res) => {
    const postBody = req.body;
        var sql = "update users set fname= '"+postBody.fname +"',lname= '"+postBody.lname+"',address= '"+postBody.address+"',gender= '" +postBody.gender+"'" ;

        console.log(sql);
        con.query(sql, function (err, result) {
          console.log("1 record inserted");
      });
  res.send(201, req.body);
});

app.route('/api/cats').post((req, res) => {
    const postBody = req.body;
      var sql = "delete from  users where username='"+postBody.username +"'";

      console.log(sql);
      con.query(sql, function (err, result) {
        console.log("1 record inserted");
      });
  res.send(201, req.body);
});


app.route('/api/cats3').post((req, res) => {
  var type="";
  var count=0;
  data = {
    type: type
};
  const postBody = req.body;
    var sql = "select type,count(*) as count from  users where username='"+postBody.username +"' and password ='"+postBody.password+"'";

    console.log(sql);
    con.query(sql, function (err, result) {
      count=result[0].count;
      if (count==0)
      {
        console.log("0");
        type="NO";

      }
      else{

        type=result[0].type;
      }
      console.log(type);
       data = {
        type: type
    };
    res.send({data : data});
    });

});

app.route('/api/cats/:name').put((req, res) => {
    console.log(name);
    res.send(200, req.body);
  });

  app.route('/api/cats/:name').delete((req, res) => {
    res.sendStatus(204);
  });



app.set('view engine', 'ejs');

app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log("Port: " + port);