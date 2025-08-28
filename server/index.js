require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser') 
const mongoose = require('mongoose')
const router = require('./routes/index')
const errorMiddleware = require('./middleware/errorHandlingMiddleware')
const path = require('path')
const fileUpload = require('express-fileupload')
const startCleanupJobs = require('./service/cleanUp')



const URL = process.env.MONGO_URI 
const PORT = process.env.PORT || 5000 


const app=express()

app.set('trust proxy', 1);

app.use(express.json())
app.use(cookieParser()) /*process.env.COOKIE_SECRET*/ 

app.use(cors({
  origin: [
    'https://dzhipus.vercel.app',
    process.env.CLIENT_URL
  ],
  credentials: true
}));


app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({limits: { fileSize: 10 * 1024 * 1024 }, 
  abortOnLimit: true}))
app.use('/api', router)
app.use(errorMiddleware)


startCleanupJobs();


mongoose
    .connect(URL)
    .then(()=>console.log("Connect to MongoDB"))
    .catch((err)=>console.log("DB connection error", err))

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})


