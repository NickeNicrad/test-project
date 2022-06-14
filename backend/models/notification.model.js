const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    pushToken: String
});

module.exports = mongoose.model('notifications', notificationSchema);