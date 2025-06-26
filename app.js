const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
app.get("/", (req, res) => {
  res.send("Hi");
});

// app.get("/testListing", async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         decription:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"India"
//     });
//     await sampleListing.save();
// console.log("Sample was saved");
// res.send("Good");

// })

//index route
app.get("/listings", async(req, res) => {
 const allListings=await Listing.find({});
 res.render("listings/index.ejs",{allListings});
});


//new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs")
})

//Show route
app.get("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/show.ejs",{listing})
})

//Create Route
app.post("/listings",async(req,res)=>{
 const newListings=new Listing(req.body.listing);
 await newListings.save();
 res.redirect("/listings"); 
})

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
})


//Update Route
app.put("/listings/:id",async(req,res)=>{
  let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  let deleteListing=await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
