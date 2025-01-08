const express = require('express');
const app = express();

app.use("/",(req,res)=>{
    res.send("Good Morning Nuruz");
});

app.use("/hello",(req,res)=>{
    res.send("Hello Nuruz");
});

app.use("/test",(req,res)=>{
    res.send("Hello Hello from the server");
});

app.listen(3000,()=> {
    console.log("Server is listening on port 3000....");
})

