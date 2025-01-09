const express = require('express');
const app = express();

// app.use("/",(req,res)=>{
//     res.send("Good Morning Nuruz");
// });

// app.use("/hello",(req,res)=>{
//     res.send("Hello Nuruz");
// });

// app.use("/test",(req,res)=>{
//     res.send("Hello Hello from the server");
// });
app.get(
    "user", 
    (req, res,next)=> {
    console.log("Handling the route user!!");
    next();
    },
    (req, res,next)=> {
        console.log("Handling the route user2!!");
        next();
        },
        (req, res,next)=> {
            console.log("Handling the route user3!!");
            next();
            },
            (req, res,next)=> {
                console.log("Handling the route user4!!");
                next();
                },
    

    
);
app.listen(3000,()=> {
    console.log("Server is listening on port 3000....");
})

