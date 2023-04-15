const express = require('express');
const path = require('path');




const app = express();


app.get('/',(req,res)=>{

    res.sendFile(path.join(__dirname,'./index.html'));


})

app.get('/video',(req,res)=>{
    res.sendFile(path.join(__dirname,'cat3.jpg'));
})

app.get('/video/:id',(req,res)=>{
    const id = req.params.id;
    
    res.sendFile(path.join(__dirname, id));

});




app.listen(5656,()=>{
    console.log("listening on port localhost:5656/ ")
});