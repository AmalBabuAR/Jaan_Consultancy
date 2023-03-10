require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')


const app = express()
app.use(express.json())
app.use((req,res,next )=>{
    
console.log(req.path, req.method)
next()
})
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))


//Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/upload'))
app.use('/builder', require('./routes/builderRouter'))
app.use('/admin', require('./routes/adminRouter'))

//Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, err => {
    if(err) throw err;
    console.log('Connected to mongodb');
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on Port',PORT);
})