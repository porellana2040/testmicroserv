const express = require('express');
const morgan = require('morgan');
const app = express();
const fetch = require('node-fetch');
var req = require("request");

//temperatura
fetch('http://api.openweathermap.org/data/2.5/weather?id=3895114&appid=6fb3041da8cb9c7add0eeac82448fda5')
  .then(response => {
    return response.json()
  })
  .then(dataT => {
    console.log(dataT)
  })


const Country = [
    {id:1, nombre: 'Chile'},
    {id:2, nombre: 'Argentina'}  
]
const City = [
    {id:1, nombre: 'Santiago'},
    {id:2, nombre: 'Arica'},
    {id:3, nombre: 'Chiloe'},  
    {id:4, nombre: 'BuenosAires'},  
    {id:5, nombre: 'SanJuan'}    
]

//middle
app.use(morgan('dev'));
app.use (express.urlencoded({extended: false}));
app.use (express.json());

//config
app.set('json spaces', 2);


app.get('/', (req, res )=>{
    res.json({"titulo": "raiz"});
});

app.get('/Location', (req, res )=>{
    res.json({City, Country});   
});


app.get('/Location/:dateString?', (req, res) => {
   const dateString = req.params.dateString;
    const dateString2 = dateString.split("-").reverse().join("-");
  
    let date
    if (!dateString2) {
      date = new Date;
    } else {

      if (!isNaN(dateString2)) {
        date = new Date(parseInt(dateString2));
      } else {
        date = new Date(dateString2);
      }
    }
    if (date.toString() === 'Invalid Date') {
      res.json({  error: date.toString() });
    } else {
      //response.json({ fecha: date.toUTCString() });
      res.json({ City, Country , fecha: date.toUTCString() });
      //console.log(dateString);
    }
  });


//rutas
app.get('/Location/:dateString?/Country', (req, res )=>{
    res.json(Country);
});


app.get('/Location/:dateString?/Country/:nombre', (req, res)=>{
    const Countries = Country.find(c => c.nombre === (req.params.nombre));
    if(!Countries) res.status(404).json('Pais incorrecto!');
    res.send(Countries)
});


app.get('/Location/:dateString?/City', (req, res )=>{
    res.json(City);
});

app.get('/Location/:dateString?/City/:nombre', (req, res)=>{
    const Cities = City.find(c => c.nombre === (req.params.nombre));
    if(!Cities) res.status(404).json('Ciudad incorrecta!');
    res.send(Cities)
});


app.listen(3000, () =>{
    console.log('Server on port ${3000}');
});