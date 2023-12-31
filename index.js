const express = require('express')
const yamlConfig = require('node-yaml-config')
const mongoose = require('mongoose')
const studentRouter = require('./routers/studentRounter')
const userRouter = require('./routers/userRouter')
const cookieParser = require('cookie-parser')

const app = express()

const config = yamlConfig.load(__dirname + '/config/config.yaml')

const errorMiddleware = require('./middleware/error_middleware')


app.use(express.json())
app.use(cookieParser())
app.use('/student',studentRouter)
app.use('/api',userRouter)
app.use(errorMiddleware)



const runApp = async () => {
    try {
        // connect to db
        await mongoose.connect(config.db_url,{
            useNewUrlParser: true,
            useUnifiedTopology :true
        })

        // start server
        app.listen(config.port,() => {
            console.log(`server started on port ${config.port}`)
        })

    } catch (e) {
        console.log(e);
    }

}

runApp()