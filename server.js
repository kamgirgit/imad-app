var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool= require('pg').Pool;
var crypto=require('crypto');
var bodyParser= require('body-parser');   //express library
var config= 
{
  user: 'kamranjmi12',
  database: 'kamranjmi12',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var names=[];
app.get('/submit-name', function(req,res)  //URL: /submit-name?name=xxxx
{
    
    //Get the  current name from request object
 //  var name= req.params.name;    //To Do
   var name= req.query.name;
    
     names.push(name);
     
     //JSON javascript object notation
     res.send(JSON.stringify(names));      // to do 
});

function createTemplate (data) {
    var title= data.title;
    var date= data.date;
    var heading=data.heading;
    var content=data.content;
    
    var htmlTemplate = ` <!DOCTYPE html>
    <html>
     <head>
         <title>
              ${title}
         </title>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link href="/ui/style.css" rel="stylesheet" />
         
     </head>    
        <body>
        <div class="container">
                
            
                    <div>
                       <a href='/'>Home </a>
                    </div>
                    <hr/>
                    <h3>
                       ${heading}
                    </h3>
                    <div>
                       ${date.toDateString()}
                    </div>
                    <div>
                      ${content}
                        </div>
            
                        </div>
        </body>
        
        </html> `;
        return htmlTemplate;
}
 
 function hash(input, salt)
 {
     //How do we create a hash ?
     var hashed = crypto.pbkdf2Sync(input, salt, 10000, 64, 'sha512');
     return["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
     
     // algorithm: md5
     //"password" => jkjsaskjkjas67agshas5ts    it can be reverse engineered
     //"password-this-is-a-random string" => asasvavsgsvgsbwbhghw565sdsdvsdsdstdsdv    it cant be reverse engineered
     
     // "password" => "password-this-is-a-random-string salt" => <hash> => <hash> x 10K times
 }
 app.get('/hash/:input', function(req,res)
 {
    var hashedString = hash(req.params.input,'this-is-some random string');
    res.send(hashedString);
 });
 
 app.post('/create-user', function(req,res)
 {  //username, password
 
   // JSON request
   var username=req.body.username;
   var password=req.body.password;
   
   var salt= crypto.getRandomBytes(128).toString('hex');
   var dbString= hash(password, salt);  
   pool.query('INSERT INTO "user" (username,password) VALUES ($1, $2)', [username, dbString], function(err, result) {
        if(err) {
           res.status(500).send(err.toString());
       } else {
           res.send('user successfully created:' + username);
       }
   });
 });


 var pool= new Pool(config);
 app.get('/test-db', function(req,res)
 {
    //make a select request 
    // return a response with the results
    pool.query('SELECT * FROM test', function(err, result)
    {
       if(err) {
           res.status(500).send(err.toString());
       } else {
           res.send(JSON.stringify(result.rows));
       }
    });
 });
 
 
 
 app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter=0;
app.get('/counter', function(req,res)
{
    counter+=1;
    res.send(counter.toString());
});


app.get('/articles/:articleName', function(req,res)
{
    // articleName == article-one
    // articles[articleName] == {} content object for article one
    var articleName = req.params.articleName;
    
    // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
    pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function(err, result)
    {
       if(err)
       {
           res.status(500).send(err.toString());
       } else 
       {
           if(result.rows.length===0)
           {
               res.status(404).send('Article not found');
           }
           else
           {
               var articleData = result.rows[0];
            res.send(createTemplate(articleData));
           }
       }
    });
 
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/myblog.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'myblog.html'));
});




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
