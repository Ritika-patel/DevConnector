const express = require('express')
const connectDB = require('./config/db')
const path = require('path')
const app = express()

// const cors = require('cors')

//connect Database
connectDB()
//Init Middlewares
app.use(express.json({ extended: false }))

//Define Routes
// app.use(cors())
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

//production
if(process.env.NODE_ENV === 'production' ){
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'))
    })
}



const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))