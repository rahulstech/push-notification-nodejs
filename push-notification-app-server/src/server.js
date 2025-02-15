const express = require('express')
const { sequelize, User, Message, Recipient } = require('./models')
const { sendPushNotification } = require('./services/FCMService')
const server = express()

server.use(express.json())

server.patch('/users/:userId/pushToken', async (req, res) => {

    const { userId } = req.params
    const { pushToken } = req.body
    
    // find user by id
    const user = await User.findOne({ where: { id: userId }})

    if (!user) {
        return res.status(404).json({ message: 'not found' })
    }

    // update the user
    await user.update({ pushToken })

    res.json({ message: 'push token updated' })
})

server.post('/users/:userId/messages', async (req, res) => {
    const { userId } = req.params
    const { message, recipient } = req.body

    // add message in db
    const newMessage = await Message.create({ sender: userId, ...message })

    // add recipient in db
    const newRecipient = await Recipient.create({ msgId: newMessage.id, userId: recipient })

    // find recipient push token from users table
    const { pushToken: destinationToken } = await User.findOne({
        raw: true,
        attributes: ['pushToken'],
        where: { 
            id: recipient,
        }
    }) 
    
    // send push notification to receipient if destinationToken exists
    if (destinationToken) {
        const { id, contentType, content, sender } = newMessage
        await sendPushNotification(destinationToken,  { id: `${id}`, sender, contentType, content })
    }

    res.json({ message: "message sent" })
})

server.get('/users/:userId/logout', async (req, res) => {
    const { userId } = req.params

    // remove the push token for the userId
    await User.update({ pushToken: null}, { 
        where: {
            id: userId
    }})

    res.json({ message: "logged out" })
})

// TODO: firewall setup while using wlan ip and connecting fom other device
sequelize.authenticate()
.then(() => {
    const { SERVER_HOST, SERVER_PORT } = process.env
    server.listen(
    SERVER_PORT, 
    SERVER_HOST,
    () => console.log(`server start http://${SERVER_HOST}:${SERVER_PORT}`))
})
.catch(err => {
    console.log(`db connnect error `, err)
})

