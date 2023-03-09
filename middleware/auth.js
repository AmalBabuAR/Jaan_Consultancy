const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")
        console.log('auth', token);
        console.log('auth', req.header("Authorization"));
        if(!token) return res.status(400).json({msg: "Invalid Authentication"})

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(400).json({msg: "Invalid Authentication"})
            console.log('auth', req.user);
            req.user = user
            console.log('auth', user);
            next()
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}  

module.exports = auth