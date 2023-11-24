const express = require('express');
const  mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');



mongoose.connect("mongodb://127.0.0.1:27017/jordanx")
.then(()=>{console.log('Connected to Mongo') })
.catch(err=>{console.log(err)})



//middleware
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());


app.get('/',(req,res)=>{
    res.send("jordan")
})
app.get('/users',(req,res)=>{
    res.send("king")
})
app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/posts',postRoute);


app.listen(8800,() => {
    console.log('backend ready on 8800')
})