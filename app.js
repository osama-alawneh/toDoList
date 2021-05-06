const express= require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

app.get('/' , (req,res) =>{
   const today = new Date();
   const currentDay = today.getDay();
   let day = '';

    switch (currentDay) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
    }
    const options = {
        kindOfDay : day,
        yourName : "Osama"
    }
    res.render("list" , options);
});



//Port Settings
const PORT = process.env.PORT || 3000;
app.listen(PORT , () =>{
    console.log(`the server is up and running at Port ${PORT}`);
});