const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");


const app = express();
app.use(express.static("public")); //it is needed if we want our server to serve up our static files such as css and images.We have to keep our static files under a folder named as "public". Now we can refer to these static files by the URL relative to the public folder.

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/signup.html");

})


app.post("/", function (req, res) {

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {                            //this is the data(java script object) that we want to send to the mailchimp server. 
        members: [                            //Inside our data object we have to provide all our key-value pairs with keys that mailchimp is going to recognize.    
            {                                 // Here members is the required body parameneter in the post request going to the mailchimp api
                email_address: email,         //Here we have a single object in our array, because we are going to subscribe one person at a time
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,         //to get the keys for merge fields log-in to mailchimp a/c---> go to All Contacts---> Settings----->Audience fields and Merge tags--->Here the names of keys are FNAME and LNAME.
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data); // Before sending data to the mailchimp server, we have to convert it into JSON format 

    const url = "https://us14.api.mailchimp.com/3.0/lists/388213e822";      // us14 here specify the server prefix. it should be the same in the api key as well.

    const options = {
        method: "POST",
        auth: "jyotsana:2d8b029d876358676a9623df218bae65-us14"  //user-->"any string:API key"     
    }


    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            // res.send("Successfully subscribed!");
            res.sendFile(__dirname + "/success.html");
        } else {
            // res.send("There was an error with signing up, please try again!");
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {

            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})





app.post("/failure", function (req, res) {

    res.redirect("/");   // redirecting the request to the home route.

})



app.listen(process.env.PORT || 3000, function () {

    console.log("server is running on port 3000.");

})



// API Key:  2d8b029d876358676a9623df218bae65-us14
// Audience Id/List Id:   388213e822  



