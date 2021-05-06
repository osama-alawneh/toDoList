const express= require('express');
const bodyParser = require('body-parser');

const app = express();
let items = ["Buy Food" , "Cook Food" , "Eat food"];

app.set('view engine' , 'ejs');

app.use(bodyParser.urlencoded({extended : true}));

app.get('/' , (req,res) =>{
   const today = new Date();
   let day = '';

    const options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    };

    day = today.toLocaleDateString("en-US" , options);

    res.render("list" , {kindOfDay : day , newListItems : items});
});

app.post('/' , (req,res) =>{
    let item = req.body.toDoInput;
    if (item !== '') {
        items.push(item);
    }
    res.redirect('/');
});


//Port Settings
const PORT = process.env.PORT || 3000;
app.listen(PORT , () =>{
    console.log(`the server is up and running at Port ${PORT}`);
});