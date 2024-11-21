const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: {type: String, required: true},
    password: { type: String, required: true },
    createOn: {type: Date, default: Date.now},
    avatar: { type: String, default: 'http://localhost:8000/api/users/uploads/defaultAvt.jpg'},
    role: {
        type: String,
        enum: ['admin', 'user'],  
        default: 'user'  
      }
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Kiểm tra mật khẩu
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
