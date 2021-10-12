const express = require('express');
const app = express();
require('dotenv').config();
const admin = require('../../../../firebase/database');
const db = admin.firestore();
const geolib = require('geolib');

//get about 
app.get("/orders",async (req,res,next)=>{
  const snapshot = await db.collection("orders2")
                  .get()
                  .then( (snapshot) => {
                    const data = snapshot.docs.map((doc) => ({ id:doc.id,...doc.data() }));
                    res.status(200).json(data); 
                    console.log(data);
                  }
                   
                  )
                  .catch( 
                    error => {
                    res.status(500).json({error:error})                   
                  });
});
//get specific
app.get("/orders/:id",async (req,res,next)=>{
  const id = req.params.id;
  const snapshot = await db.collection("orders2")
               //  .where(admin.firestore.FieldPath.documentId(), "==", id) 
                  .where("data.customerNumber", "==", id)
                  .get()
                  .then( (snapshot) => {
                    const data = snapshot.docs.map((doc) => ({ id:doc.id,...doc.data() }));
                    res.status(200).json(data); 
                    console.log(data);
                  }
                   
                  )
                  .catch( 
                    error => {
                    res.status(500).json({error:error})                   
                  });
});
//post about
app.post("/orders",async (req,res,next) =>{
  const data = req.body;
    let snapshot= await db.collection("orders2")
        .add(data)
        .then(
           (snapshot) => {
            //var postID = snapshot.key();
            const id = snapshot.id;
            res.status(200).json({"id":id,"message":"Done"});
            
           } 
         
        )
        .catch(
            error => {
                res.status(500).json({error:error})                   
              }
        );

});
//update about

app.put("/orders",async (req,res,next)=>{
    const id = req.body.id;
    delete req.body.id;
    const data = req.body;
    let snapshot= await db.collection("orders2")
        .doc(id)
        .update({
          data:data      
                })
        .then(
           (snapshot) => {
             res.status(200).json({message:"Done"});
               } 
            )
        .catch(
            error => {
            res.status(500).json({error:error})                   
               }
              );        
 
});

//delete about
app.delete("/orders/:id",async (req,res,next) =>{
  const id = req.params.id;
  //const data = req.body;
  let snapshot= await db.collection("orders2")
      .doc(id)
      .delete()
      .then(
         (snapshot) => {
           res.status(200).json({message:"Done"});
             } 
          )
      .catch(
          error => {
          res.status(500).json({error:error})                   
             }
            );  
});

module.exports = app;