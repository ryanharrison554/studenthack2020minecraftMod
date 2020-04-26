import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    dmChannel: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userTag: {
        type: String,
        required: true
    }
});

const User = mongoose.model('sh2020_User', UserSchema);

export default User;