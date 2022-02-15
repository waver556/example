const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const User = require('./model/user')
const PORT = process.env.PORT || 3000
const md5 = require('md5');

app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'frontend')))
app.use(bodyParser.json())




app.post('/api/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username, password }).lean()

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid username/password' })
    }
    if (await (password)) {  //md5.compare этот момент надо решить md5 password compare
        return res.json({status: 'Authorization succeeded!'})

    }
    res.json({status: 'You entered the right data', message : 'Иди нахуй'})
})




app.post('/api/register', async (req, res) => {
    const { username, password: plainTextPassword } = req.body

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username' })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plainTextPassword.length < 1) {
        return res.json({
            status: 'error',
            error: 'Password too small. Should be atleast 1 characters'
        })
    }
    const password = await md5(plainTextPassword, 10)

    try {
        const response = await User.create({
            username,
            password
        })
        console.log('User created=)): ', response)
    } catch(error) {
        if (error.code === 11000) {
            return res.json({ status: 'error', error: 'User already in use'})
        }
        throw error
    }
    res.json({ status:'ok', hashedPass: { password } })
})


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'))
})


const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://2:2@cluster0.fypty.mongodb.net/222022?retryWrites=true&w=majority`)

        app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()
