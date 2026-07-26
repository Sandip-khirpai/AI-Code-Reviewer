require('dotenv').config()  // Load environment variables from .env file

const app= require('./src/app')  // import the app.js file which contains the express server setup  





app.listen(3000,()=>{
    console.log("server is running on http://localhost:3000");
} )