import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    heading: {
        type: String,   
        required: true
    
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error'],
        default: 'info'
    },
    // A notification Can be also system generated
    isSystemGenerated: {
        type: Boolean,
        default: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'Admin',
    },
    receiverId: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;