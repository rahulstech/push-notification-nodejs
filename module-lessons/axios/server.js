const server = require('express')()

server.get('/getTokenHeader', (req, res) => {
    const authorization = req.headers.authorization
    res.send(`authorization = ${authorization}`)
})

server.get('/overriddenHeader', (req, res) => {
    const xName = req.headers['x-name']
    res.send(`x-name: ${xName}`)
})

server.listen(3000, () => console.log('server started at port 3000'))