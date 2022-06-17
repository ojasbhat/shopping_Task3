const port=80;
const path=require("path");
const datastore=require("nedb");
const express=require("express");
// const { loadavg } = require("os");
const app=express();
const database= new datastore('database.db');
database.loadDatabase();
app.use(express.urlencoded())

//set view engine to pug
app.set("view engine","pug");

// setting the views directory as views
app.set("views",path.join(__dirname,"views"));

database.persistence.compactDatafile();
//setting the endpoint
app.get("/",(req,res)=>{
    // let params={'title':'This is Heading','content':'This is better than goood stuff'};
    res.status(200).render("home.pug");
})
app.get("/view",(req,res)=>{
    database.find({},function(err, docs){
        // if(err){
        //     res.end('error');
        //     return ;
        // }
        res.json(docs);
    })
})
app.get("/delete",(req,res)=>{
//     let params={'title':'This is Heading','content':'This is better than goood stuff'};
    res.status(200).render("delete.pug");
})
app.post("/delete",(req,res)=>{
    database.remove({ Title:req.body.Title}, {}, function (err, numRemoved){});
    res.render("delete.pug")
})
app.post("/",(req,res)=>{
    console.log(req.body);
    database.findOne({Title:req.body.Title}, function(err, docs) {
        if(docs!=null){    
            console.log("DATA EXists");
            database.update(
                {Title:req.body.Title},
                { $set: {Rating:req.body.Rating,Price:req.body.Price,Description:req.body.Description} },
                {},
                function (err, numReplaced) {
                    console.log("replaced---->" + numReplaced);

                    database.loadDatabase();
                  }
                )
                }
            else
            database.insert(req.body);
        });
    res.render("home.pug");
})



//listening to server
app.listen(port,()=>{
    console.log(`Listening on port number- ${port}`);
})