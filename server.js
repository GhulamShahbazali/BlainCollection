const user= require('./Models/user');
const express = require('express');
const database=require('./database');
const router = require('./Routes/routers');

const app = express();
database();

app.use(express.json());
app.use('/uploadImages', express.static('uploadImages'));
app.use('/auth',router);
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
app.listen(9000,()=>{
    console.log('server is runing on port 4000')
})