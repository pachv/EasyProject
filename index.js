const express = require('express')
const yamlConfig = require('node-yaml-config')
const mongoose = require('mongoose')
const studentRouter = require('./routers/studentRounter')

const app = express()

const config = yamlConfig.load(__dirname + '/config/config.yaml')

app.use(express.json())
app.use('/student',studentRouter)


const runApp = async () => {
    try {

        await mongoose.connect(config.db_url,{
            useNewUrlParser: true,
            useUnifiedTopology :true
        })

        app.listen(config.port,() => {
            console.log(`server started on port ${config.port}`)
        })

    } catch (e) {
        console.log(e);
    }

}

runApp()