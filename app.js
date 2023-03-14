const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https")

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")) /*bootstrap we are using comes from
a remote location, while the images and css we are using are local and static
hence to handle these static files we have this special function in express
The signup.html is also a static page in our local file system so in
order to serve up static files we need a static folder*/

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",function (req,res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email; 

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/1a68d876d5"
    const options = {
        method: "POST",
        auth: "Newsletter:16266f40d212e1c7f848f77a5f97fdbf-us21",
    }
    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    })

    request.write(jsonData);
     request.end();
  })

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(3000, function(req,res){
    console.log("Server Started");
})

// API Key(name: Newsletter)
// 6cc58cf33a66a7c3ad3cf1255ae50114-us21

//New API Key
//16266f40d212e1c7f848f77a5f97fdbf-us21

// list id (helps mailchimp identify the list you want your subscribers to be into)
// 1a68d876d5