const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
import verifyToken from '../middleware/auth'
require('dotenv').config()

const User = require('../models/User')


router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) return res.status(400).json({
            success: false,
            message: 'user not found'
        })
        else return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: 'chet server'
        })
    }
})


router.get('/', (req, res) => res.send('User router'))
router.post('/register', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {

        return res.status(400).json({
            success: false,
            message: 'Missing username or password'
        })
    }
    try {
        const user = await User.findOne({
            username: username
        })
        if (user)
            return res.status(400).json({
                success: false,
                message: "username already taken"
            })
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({
            username, password: hashedPassword
        })
        await newUser.save()


        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCES_TOKEN_SECRET)
        return res.status(200).json({
            success: true,
            message: "thanh cong nhe",
            accessToken
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "chet server"
        })

    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing username or password'
        })
    }

    try {
        const user = await User.findOne({ username })
        if (!user)
            return res.status(200).json({ success: false, message: "incorrect username or pass" })

        const passwordValid = await argon2.verify(user.password, password)

        if (!passwordValid)
            return res.status(200).json({ success: false, message: "incorrect usernam" })


        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCES_TOKEN_SECRET)
        return res.json({
            success: true,
            message: "User logged thanh cong nhe",
            accessToken
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "chet server"
        })
    }
})
module.exports = router