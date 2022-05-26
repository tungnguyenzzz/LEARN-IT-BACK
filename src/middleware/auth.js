import jwt from "jsonwebtoken";
require('dotenv').config()
const verifyToken = (req, res, next) => {
    let authHeader = req.header('Authorization')
    let token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'access token not found'
        })
    }
    try {
        let decoded = jwt.verify(token, process.env.ACCES_TOKEN_SECRET)
        req.userId = decoded.userId // gan userId vao req de no duoc di tiep de kiem tra userId
        next();
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            success: false,
            message: 'invalid token'
        })
    }
}

module.exports = verifyToken