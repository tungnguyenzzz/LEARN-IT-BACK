const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
import verifyToken from '../middleware/auth'
const argon2 = require('argon2')

require('dotenv').config()
const Post = require('../models/Post')

router.get('/', verifyToken, async (req, res) => {
    try {
        let posts = await Post.find({
            user: req.userId
        }).populate('user', ['username'])
        return res.status(200).json({
            success: true,
            posts
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "chet server"
        })
    }
})






router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body
    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'thieu title'
        })
    }
    try {
        const newPost = new Post({
            title,
            description,
            url: (url.startsWith('https://') ? url : `https://${url}`),
            status: status || 'TO LEARN',
            user: req.userId
        })
        await newPost.save()
        res.status(200).json({
            success: true,
            message: 'happy learning',
            post: newPost
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'chet server'
        })
    }

})


router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body
    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'thieu title'
        })
    }
    try {
        let updatedPost = {
            title,
            description: description || '',
            url: ((url.startsWith('https://') ? url : `https://${url}`)) || '',
            status: status || 'TO LEARN'
        }

        const postUpdateCondition = {
            _id: req.params.id,
            user: req.userId
        } // dieu kien: id post trung voi params va id nguoi dung phai so huu bai post nay` 


        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, { new: true })

        //
        if (!updatedPost) {
            return res.status(401).json({
                success: false,
                message: 'post khong tim thay hoac khong dung nguoi dung'
            })
        }
        else
            return res.status(200).json({
                success: true,
                message: 'thanh cong con me m luon nhe',
                post: updatedPost
            })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'chet server'
        })
    }
})


router.delete('/:id', verifyToken, async (req, res) => {
    try {
        let postDeleteCondition = {
            _id: req.params.id,
            user: req.userId
        }

        let deletePost = await Post.findOneAndDelete(postDeleteCondition)

        if (!deletePost) {
            return res.status(401).json({
                success: false,
                message: 'delete that bai'
            })
        }
        else {
            return res.status(200).json({
                success: true,
                message: 'delete success',
                post: deletePost
            })
        }
    } catch (error) {

    }
})

module.exports = router