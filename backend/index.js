const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

const NotificationSchema = require('./models/notification.model');

// init defaul server port
const PORT = process.env.PORT || 5000;

// init middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

// notification sender
const sendNotifications = async () => {
    try {
        const pushTokens = await NotificationSchema.find();
        pushTokens.forEach(async (item) => {
            const message = {
                to: item?.pushToken,
                title: "Darcin's Notification",
                subtitle: 'Notification Test',
                body: "This is Darcin's Notification for the React Native Test Project",
                data: {"content-available": 1},
                ttl: 20,
                priority: 'high',
                sound: 'default',
            };

            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
        });
    } catch (error) {
        console.log(error);
    }
}
// this function get executed every 20seconds
setInterval(sendNotifications, 20000);

// this function creates a new phone identifier token
app.post('/notification/create', async (req, res) => {
    const {expoPushToken} = req.body;
    try {
        if (!expoPushToken) return res.status(409).json('no token available');
        const token = await NotificationSchema.findOne({pushToken: expoPushToken});
        if (!token) {
            const tokenData = new NotificationSchema({pushToken: expoPushToken});
            const token = await tokenData.save();
            return res.status(201).json(token);
        }
    } catch (error) {
        console.log(error);
    }
});

// create notification
const DB_URL = 'mongodb+srv://NickeNicrad:thenewstars03@cluster0.v6idyna.mongodb.net/?retryWrites=true&w=majority';

// connecting to a mongo database
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log('database successfully connected\nserver runnig on port: ', PORT)))
    .catch((err) => console.log("database not connected! ", err.message));