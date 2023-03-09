const jwt = require('jsonwebtoken')

const adminAuth = (req, res, next) => {
    try {
        const token = req.header("Authorization")
      
        console.log('auth1', token);
        console.log('auth2', req.header("Authorization"));
        if(!token) return res.status(400).json({msg: "Invalid Authentication"})

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err)  return res.status(400).json({msg: "Invalid Authentication"})
            console.log('auth3', req.user);
            req.user = user
            console.log('auth4', user);
            next()
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({msg: err.message})
    }
}  

module.exports = adminAuth