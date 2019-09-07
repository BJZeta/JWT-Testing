const express = require('express');

const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', function (req, res) {
    res.json({
        message: 'Welcome to the API'
    })
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post Created',
                authData
            });
        }
    })
});

app.post('/api/login', (req, res) => {
    //Mock User
    const user = {
        id: 1,
        username: 'Peter',
        email: 'pbPark@gmail.com'
    }

    jwt.sign({user}, 'secretkey', { expiresIn: '30m' }, (err, token) => {
        res.json({
            token
        })
    });
})

//FORMAT OF TOKEN
//Authorization: Bearer <access_token>

//VerifyToken

function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from array 
        const bearerToken = bearer[1];
        //Set token
        req.token = bearerToken;
        //Next middleware
        next();
    } else {
        //forbideen
        res.sendStatus(403);
    }

}

app.listen(5000, function () {
    console.log("Server Started On 5000");
})