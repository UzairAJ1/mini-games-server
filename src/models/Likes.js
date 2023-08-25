const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    likerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Likes = mongoose.model('Like', likeSchema);

module.exports = {
    Likes,
};