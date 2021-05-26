        //dependencies -------------
const express= require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/Date.js");


const app = express();
mongoose.connect("mongodb://localhost:27017/todolistDB" , {useUnifiedTopology: true,useNewUrlParser:true ,useFindAndModify: false, });

const itemsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
    }
});

const listSchema = new mongoose.Schema({
    name: String,
    items : [itemsSchema]
});

const Item = mongoose.model("Item" , itemsSchema);
const List = mongoose.model("List" , listSchema);


        //view engine ----------------------
app.set('view engine' , 'ejs');

        //Middleware Functions -------------------
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

//Get Main route  -----------------

const firstItem = new Item({
     name: "Buy Food"
});

const secondItem = new Item({
    name: "Cock Food"
});

const thirdItem = new Item({
    name: "Eat Food"
});

const defaultItems = [firstItem , secondItem , thirdItem];



app.get('/' , (req,res) =>{
        //date Function in separate file and we required it using (module.exports)
    const day = date.getDate();
    Item.find()
    .then(result =>{
        if (result.length === 0){
            Item.insertMany(defaultItems , (err) =>{
               if (err){
                    console.log(err);
               }else {
                    console.log("the items inserted successfully");
               }
            });
            res.redirect('/');
        }else {
            res.render("list" , {listTitle : day , newListItems : result});
        }
    })
    .catch(err => {
        console.log(err);
    });
});


        // Post To Main Route --------------------
app.post('/' , (req,res) =>{
    const item = req.body.toDoInput;
    const listName = req.body.list;
    const day = date.getDate();

    const tempItem = new Item({
        name: item
    });

    if (listName === day){
        tempItem.save()
            .catch(err =>{
                console.log(err);
            });
        res.redirect('/');
    } else {
        List.findOne({name: listName})
            .then(result =>{
                result.items.push(tempItem);
                result.save();
                res.redirect('/' + listName);
            })
            .catch(err =>{
                console.log(err);
            })
    }

    });

app.post("/delete" , (req , res) =>{
    const id = req.body.checkBox;
    const listName = req.body.listName;
    const day = date.getDate();

    if (listName === day){
        Item.findByIdAndRemove(id , (err) =>{
            if (err){
                console.log(err);
            } else {
                console.log(`the Item with id ${req.body.checkBox} is deleted successfully`);
            }
        });
        res.redirect('/');

    } else {
        List.findOneAndUpdate({name:listName} , {$pull: {items:{_id:id} }})
            .then(result =>{
                res.redirect('/' + listName);
            })
            .catch(err =>{
                console.log(err);
            });
    }
});


        // Get work Route ---------------------
app.get("/:customListName" , (req , res) =>{
   const customListName = _.capitalize(req.params.customListName);

   List.findOne({name: customListName} , (err , result) =>{
      if (!err) {
          if (!result){
              const list = new List({
                  name: customListName,
                  items: defaultItems
              });
              list.save();
              res.redirect('/' + customListName)
          }else {
              res.render("list" , {listTitle : result.name , newListItems : result.items})
          }
      }
   });

});


        //Get about route ------------------------
app.get('/about' , (req,res) =>{
   res.render('about');
});


        //Port Settings --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT , () =>{
    console.log(`the server is up and running at Port ${PORT}`);
});