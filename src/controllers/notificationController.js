import Notification from "../model/notificationModel.js";

const createNotification = async (message, heading, type, isSystemGenerated, receiverId, senderId) => {
    try {
        if (!message || !heading || !receiverId) {
            return false;
        }

        const notification = new Notification({
            message,
            heading,
            type: type || 'info',
            isSystemGenerated: isSystemGenerated || false,
            senderId: senderId || null, 
            receiverId
        });

        await notification.save();
        return true;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const notificationsCount = await Notification.countDocuments({ receiverId: req.admin.id });
        const totalPages = Math.ceil(notificationsCount / limit);
        
        const notifications = await Notification.find({ receiverId: req.admin.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('senderId', 'name email _id');

        res.status(200).json({ 
            notifications,
            totalPages,
            currentPage: Number(page),
            totalNotifications: notificationsCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const {notificationId } = req.body;
        if(!notificationId) {
            return res.status(400).json({ message: 'Notification ID is required' });
        }

        const notification = await Notification.findById(notificationId);
        if (!notification) {   
            return res.status(404).json({ message: 'Notification not found' });
        }

        if(notification.receiverId.toString() !== req.admin.id) {
            return res.status(403).json({ message: 'You are not authorized to mark this notification as read' });
        }

        if(notification.isRead) {
            return res.status(400).json({ message: 'Notification is already marked as read' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: 'Notification marked as read successfully', notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export default {
    createNotification,
    getNotifications,
    markAsRead
};