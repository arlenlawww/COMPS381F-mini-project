const html = require('html');
const url = require('url');
const fs = require('fs'); 
const assert = require('assert');
const objId = require('mongodb').objId;
const formidable = require('express-formidable');
const MongoClient = require('mongodb').MongoClient;
<<<<<<< HEAD
const mongourl = 'mongodb+srv://arlenbb:eIY2YXjLXA2DtceT@cluster0.sbgl1bc.mongodb.net/?retryWrites=true&w=majority';
=======
const mongodburl = 'mongodb+srv://arlenbb:eIY2YXjLXA2DtceT@cluster0.sbgl1bc.mongodb.net/?retryWrites=true&w=majority';
>>>>>>> 503e711 (init)
const dbName = 'information';
const express = require('express');
const app = express();
const session = require('cookie-session');
const bodyParser = require('body-parser');
const { Buffer } = require('safe-buffer');

var users = new Array(
	{name: "student1", password: "password1"},
    {name: "teacher1", password: "password2"},
    {name: "teacher2", password: "password3"}
);
var DOC = {};

app.set('view engine', 'ejs');
app.use(formidable());
app.use(bodyParser.json());
app.use(session({
    userid: "session",  
    keys: ['key$1'],
}));

const createDocument = (db, createDoc, callback) => {
    const client = new MongoClient(mongodburl);
    client.connect((err) =>{
        assert.equal(null, err);
        console.log("DB connection successful");
        const db = client.db(dbName);

        db.collection('information').insertOne(createDoc, (error, results)=>{
            if(error) throw error;
            console.log(results);
            callback();
        });
    });
}

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('information').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err, docs)=>{
        assert.equal(err, null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}
const deleteDocument = (db, criteria, callback) => {
    db.collection('information').deleteOne(
       criteria, 
       (err, results) => {
          assert.equal(err, null);
          console.log(results);
          callback();
       }
    );
};
const updateDocument = (criteria, updateDoc, callback) => {
    const client = new MongoClient(mongodburl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("DB connection successful");
        const db = client.db(dbName);

        db.collection('information').updateOne(criteria,
            {
                $set : updateDoc
            },
            (err, results) => {
                client.close();
                assert.equal(err, null);
                callback(results);
            }
        );
    });
}

const handle_Find = (req, res, criteria) =>{
    const client = new MongoClient(mongodburl);
    client.connect((err)=>{
        assert.equal(null, err);
        console.log("DB connection successful");
        const db = client.db(dbName);
        
        findDocument(db, {}, (docs)=>{
            client.close();
            console.log("Closed DB connection.");
            res.status(200).render('home', {name: `${req.session.userid}`, linformation: docs.length, information: docs});
        });
    });
}

const handle_Details = (res, criteria) => {
    const client = new MongoClient(mongodburl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("DB connection successful");
        const db = client.db(dbName);

        let DOCID = {};
        DOCID['id_'] = objId(criteria.id_);
        findDocument(db, DOCID, (docs) => {  
            client.close();
            console.log("DB connection closed");
            res.status(200).render('details', {information: docs[0]});
        });
    });
}

const handle_Delete = (res, criteria) =>{
    const client = new MongoClient(mongodburl);
    client.connect((err) => {
        console.log("Connection seccessful");
        const db = client.db(dbName);

        let DOCID = {};
        DOCID['id_'] = objId(criteria.id_);
        DOCID['teacher'] = criteria.teacher;
        deleteDocument(db, DOCID, (results)=>{
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('info', {message: "The information has been deleted."});
        })     
    });
    client.close();
    res.status(200).render('info', {message: "Document has been deleted."});
}

app.get('/', (req, res)=>{
    if(!req.session.authenticated){
        console.log("Please login again.");
        res.redirect("/login");
    }
    console.log("Welcome, user");
    handle_Find(req, res, {});
});

app.get('/login', (req, res)=>{
    console.log("Login here");
    res.sendFile(__dirname + '/public/login.html');
    res.status(200).render("login");
});

app.post('/login', (req, res)=>{
    console.log("Logging in...");
    users.forEach((user) => {
		if (user.name == req.fields.username && user.password == req.fields.password) {
        req.session.authenticated = true;
        req.session.userid = req.fields.username;
        console.log(req.session.userid);
        res.status(200).redirect("/home");
        }
    });
    res.redirect("/");
});
app.use((req, res, next) => {
    console.log("Login authenticating...");
    if (req.session.authenticated){
      next();
    } else {
      res.redirect("/login");
    }
});

app.get('/logout', (req, res)=>{
    req.session = null;
    req.authenticated = false;
    res.redirect('/');
});

app.get('/home', (req, res)=>{
    console.log("Directing to Home page")
    const client = new MongoClient(mongodburl);
    client.connect((err)=>{
        assert.equal(null, err);
        console.log("Connection seccessful.");
        const db = client.db(dbName);
        
        findDocument(db, {}, (docs)=>{
            client.close();
            console.log("Closed DB connection.");
            res.status(200).render('home', {name: `${req.session.userid}`, linformation: docs.length, information: docs});
        });
    });

});

app.get('/details', (req,res) => {
    handle_Details(res, req.query);
});

app.get('/create', (req, res)=>{
    res.status(200).render("create");
});
app.post('/create', (req, res)=>{
    console.log("...create a new document!");
    const client = new MongoClient(mongodburl);
    client.connect((err)=>{
        assert.equal(null, err);
        console.log("Connection seccessful.");
        const db = client.db(dbName);
                
var timestamp = Math.floor(new Date().getTime()/1000);

var timestampDate = new Date(timestamp*1000);

var informationId = new informationId(timestamp);

	DOC["id_"] = informationId;

        DOC['info_id']= "";
        DOC['stu_name']= req.fields.stu_name;
        DOC['stu_id']= req.fields.stu_id;
        DOC['age']= req.fields.age;
        DOC['programme']= `${req.session.programme}`;
        DOC['con_no']= `${req.session.con_no}`;
        DOC['cgpa']= `${req.session.cgpa}`;
        DOC['teacher']= `${req.session.teacher}`;

        var stu_photo = {};
        if (req.files.photo && req.files.photo.size > 0 && (stu_photo['mimetype'] == 'image/jpeg' || stu_photo['mimetype'] == 'image/png')) {
            fs.readFile(req.files.photo.path, (err, data) => {
                assert.equal(err,null);
                stu_photo['title'] = req.fields.title;
                stu_photo['data'] = new Buffer.from(data).toString('base64');
                stu_photo['mimetype'] = req.files.photo.type;
                    
            });
        } 
        DOC['photo'] = stu_photo;
        
        if(DOC.stu_name &&  DOC.teacher){
            console.log("Creating");
            createDocument(db, DOC, (docs)=>{
                client.close();
                console.log("Closed DB connection");
                res.status(200).render('info', {message: "Document has been created."});
            });
        } else{
            client.close();
            console.log("DB connection closed.");
            res.status(200).render('info', {message: "Invalid, please input student name and teacher."});
        }
    });
    client.close();
    console.log("Closed DB connection");
    res.status(200).render('info', {message: "Document created"}); 
});

app.get('/edit', (req, res)=>{
    console.log("Directing to update page");
    const client = new MongoClient(mongodburl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        let DOCID = {};
        DOCID['id_'] = objId(req.query.id_);
        findDocument(db, DOCID, (docs) => {  
            client.close();
            console.log("Closed DB connection");
            console.log(docs[0]);
            res.status(200).render('edit', {information: docs[0]});
        });
    });

}); 
app.post('/update', (req, res)=>{
    var updateDOC={};
    console.log("Updating now");
    const client = new MongoClient(mongodburl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            
            
            if(req.fields.teacher == req.session.userid){
                if(req.fields.name){
                updateDOC['stu_name']= req.fields.stu_name;
                updateDOC['stu_id']= req.fields.stu_id;
                updateDOC['age']= req.fields.age;
                updateDOC['programme']= `${req.session.programme}`;
                updateDOC['con_no']= `${req.session.con_no}`;
                updateDOC['cgpa']= `${req.session.cgpa}`;
                updateDOC['teacher']= `${req.session.teacher}`;


               
                var DOCID = {};
                DOCID['id_'] = objId(req.fields.id_);
                if (req.files.photo.size > 0) {
                    var stu_photo = {};
                    fs.readFile(req.files.stu_photo.path, (err, data) => {
                        assert.equal(err,null);
                        stu_photo['title'] = req.fields.title;
                        stu_photo['data'] = new Buffer.from(data).toString('base64');
                        stu_photo['mimetype'] = req.files.stu_photo.type;
                            
                    });
                    updateDOC['photo'] = stu_photo;
                    updateDocument(DOCID, updateDOC, (docs) => {
                        client.close();
                        console.log("Closed DB connection");
                        res.status(200).render('info', {message: "Document has been updated!"});
                    });
                }else{
                    updateDocument(DOCID, updateDOC, (docs) => {
                        client.close();
                        console.log("Closed DB connection");
                        res.status(200).render('info', {message: "Document has been updated!"});
                    });
                }
            }else{
                res.status(200).render('info', {message: "Invalid! Name cannot be empty."});}
              
    }else{
                res.status(200).render('info', {message: "Invalid, only teacher can delete the information."});
            }
    });  
});

app.get('/delete', (req, res)=>{
    if(req.session.userid == req.query.teacher){
        console.log("Hi, teacher.");
        handle_Delete(res, req.query);
    }else{
        res.status(200).render('info', {message: "Only the teacher can delet the information."}); 
    }});

app.get('/api/information/name/:name', function(req,res)  {
    console.log("RESTful fucntion");
	console.log("name: " + req.params.name);
    if (req.params.name) {
        let criteria = {};
        criteria['name'] = req.params.name;
        const client = new MongoClient(mongodburl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Server connected successfully.");
            const db = client.db(dbName);

            findDocument(db, criteria, (docs) => {
                client.close();
                console.log("DB connection closed.");
                res.status(200).json(docs);
            });
        });
    } else {
        res.status(500).json({"error": "Name is missing."});
    }});

app.get('/api/information/stu_id/:stu_id', (req,res) => {
    console.log("...Rest Api");
	console.log("stu_id: " + req.params.stu_id);
    if (req.params.stu_id) {
        let criteria = {};
        criteria['stu_id'] = req.params.stu_id;
        const client = new MongoClient(mongodburl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Server connected successfully.");
            const db = client.db(dbName);
            findDocument(db, criteria, (docs) => {
                client.close();
                console.log("DB connection closed.");
                res.status(200).json(docs);
            });
        });
    } else {
        res.status(500).json({"error": "Student ID is missing."});
    }
});

app.get('/*', (req, res)=>{
    res.status(404).render("info", {message: `${req.path} - please request again.`})});
app.listen(process.env.PORT || 8099);
