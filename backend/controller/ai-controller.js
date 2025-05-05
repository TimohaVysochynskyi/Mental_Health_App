import Message from '../models/messageSchema.js';
import User from '../models/userModel.js';

export const getMessages = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const messages = await Message.find({ userId: user._id }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { sender, text } = req.body;

    if (!['user', 'ai'].includes(sender)) {
      return res.status(400).json({ message: 'Invalid sender value' });
    }

    const message = new Message({
      userId: user._id,
      sender,
      text,
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: error.message });
  }
};
