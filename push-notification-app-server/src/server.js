const express = require('express')
const { sequelize, User, Message, Recipient, Group, Member, GroupMessage } = require('./models')
const { sendPushNotification, subscribeToTopic, sendMessageInTopic } = require('./services/FCMService');
const { randomBytes } = require('node:crypto');

const server = express()

server.use(express.json());

async function addNewMessage({ sender, content, contentType }) {
    const newMessage = await Message.create({ sender, content, contentType });
    return newMessage.toJSON();
}

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
    const newMessage = await addNewMessage({ sender: userId, ...message });

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
        await sendPushNotification(destinationToken,  { type: 'p2p', id: `${id}`, sender, contentType, content })
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
});

// create a new group
server.post('/groups', async (req,res)=>{
    const { name } = req.body;
    const topicName = randomBytes(32).toString('hex');

    const newGroup = await Group.create({ name, topicName });
    if (!newGroup) {
        return res.status(500).json({ message: "group not created" });
    }

    res.status(201).json({ id: newGroup.id, name });
});

// add members to a group
server.post('/groups/:groupId/members', async (req,res)=>{
    const { memberId } = req.body;
    const { groupId } = req.params;

    const group = await Group.findOne({
        where: {
            id: groupId,
        }
    });

    const user = await User.findOne({
        where: {
            id: memberId
        }
    });

    // add group member
    const newMember = await Member.create({ groupId, memberId });
    if (!newMember) {
        return res.status(500).json({ message: "member not added" });
    }
    
    // add member to the topic
    if (user.pushToken) {
        await subscribeToTopic( user.pushToken, group.topicName);
    }
    
    res.status(201).json({ message: "group member added" });
});

// send message in group
server.post('/groups/:groupId/messages', async (req,res)=> {

    const { sender, message } = req.body;
    const { groupId } = req.params;

    // add menssage
    const newMessage = await addNewMessage({ sender, ...message });

    // link message and group
    const newGroupMessage = await GroupMessage.create({ groupId, messageId: newMessage.id });

    // get the push topic for the group 
    const group = await Group.findOne({ 
        raw: true,
        attributes: ['id', 'topicName'],
        where: {
            id: groupId,
        }
    });

    // send message to all members in the topic
    const { id, contentType, content } = newMessage
    const msgContent = { type: 'group', id: `${id}`, contentType, content, sender: `${sender}`, group: `${groupId}` };
    console.log('msgContent ', msgContent);
    await sendMessageInTopic(group.topicName,msgContent);

    res.status(201).json({ message: msgContent });
});

server.get('/user/:userId/groups', async (req, res) => {
    const { userId } = req.params;

    const members_with_groups = await Member.findAll({
        raw: true,
        nest: true, // changes 'Gruop.id' = 1 => Group: { id: 1 }
        include: {
            model: Group,
            attributes: ['id', 'name'],
        },
        where: {
            memberId: userId,
        }
    });

    const groups = members_with_groups.map(v => v.Group);

    res.json({ groups });
});

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

