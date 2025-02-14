const express = require('express')
const { sequelize, User, Message, Recipient } = require('./models')
const { sendPushNotification } = require('./services/FCMService')
const server = express()

server.use(express.json())

server.patch('/users/:userId/pushToken', async (req, res) => {

    const { userId } = req.params
    const { pushToken } = req.body
    
    const [count] = await User.update({ pushToken }, {
        where: { id: userId },
    })

    if (count === 1) {
        res.json({ message: 'push token updated' })
    }
    else {
        res.status(400).json({ message: 'push token not updated' })
    }
})

server.post('/users/:userId/messages', async (req, res) => {
    const { userId } = req.params
    const { message, recipient } = req.body

    // add message in db
    const newMessage = await Message.create(message)

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
        const title = `Message from ${recipient}`
        const body = message.content 
        await sendPushNotification(destinationToken,  {title, body})
    }

    res.json({ message: "message sent" })
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

