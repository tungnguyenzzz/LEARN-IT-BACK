const express = require('express')
const mongoose = require('mongoose')
import bodyParser from 'body-parser';
const authRouter = require('./routes/auth')
import postRouter from './routes/post'
const cors = require('cors')
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://root:root@mern-learnit.2qrlk.mongodb.net/mern-learnit?retryWrites=true&w=majority", {
            // useCreateIndex: true,
            // useNewUrlParse: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false

        })
        console.log('ket noi Mongo thanh cong')
    } catch (error) {
        console.log(error)
        process.exit(1)

    }
}
connectDB()
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json())
app.use(cors())
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)

const PORT = 5001

app.listen(PORT, () => {
    console.log('server dang chay voi cong', PORT)
})