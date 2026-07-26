const express= require('express');
const aiRoutes = require("./routes/ai.route");  // import the ai.route.js file which contains the routes for AI related endpoints
const cors= require('cors')


const app=express()   // create a server using express
app.use(cors()) 

app.use(express.json())  // middleware to parse incoming JSON requests

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.use('/ai',aiRoutes)  // use the aiRoutes for any request that starts with /ai

module.exports=app;
