const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// Đăng ký người dùng
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
});
// router.post('/signup', async (req, res) => {
//     const { username, email, password } = req.body;  // Lấy thông tin từ request body
    
//     try {
//         // Kiểm tra xem người dùng đã tồn tại với username hoặc email chưa
//         const existingUserByUsername = await User.findOne({ username });
//         if (existingUserByUsername) {
//             return res.status(400).json({ message: 'Username already exists' });
//         }

//         const existingUserByEmail = await User.findOne({ email });
//         if (existingUserByEmail) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu (bảo mật)
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Tạo một đối tượng người dùng mới với username, email, và mật khẩu đã mã hóa
//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword
//         });

//         // Lưu người dùng vào cơ sở dữ liệu
//         await newUser.save();

//         // Trả về phản hồi thành công
//         res.status(201).json({ message: 'User registered successfully' });

//     } catch (err) {
//         // Nếu có lỗi trong quá trình đăng ký
//         res.status(500).json({ message: 'Error registering user', error: err });
//     }
// });

// Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Tạo token JWT
        const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log(token);
        res.json({ token });
        
    } catch (err) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Route bảo vệ yêu cầu người dùng đã đăng nhập
router.get('/protected', authenticateToken, (req, res) => {
    const token = req.headers['authorization'];
    const decoded = jwt.decode(token); // Giải mã để lấy thông tin
    res.json({
        message: 'Welcome to the protected route',
        user: req.user,
        expiresIn: decoded.exp ? new Date(decoded.exp * 1000).toString() : 'No expiry info'
    });
});

// Cấu hình multer để lưu trữ ảnh
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Thư mục để lưu ảnh
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`); // Đổi tên file để tránh trùng lặp
//     }
// });
// const upload = multer({ storage });
// // API để đổi ảnh đại diện
// router.post('/account-management/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
//     const currentUser = req.currentUser;
//     const avatarPath = req.file.path; // Đường dẫn tới file đã upload

//     try {
//         // Cập nhật ảnh đại diện trong cơ sở dữ liệu
//         const user = await User.findById(currentUser.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         user.avatar = avatarPath; // Giả sử bạn đã có trường 'avatar' trong model User
//         await user.save();

//         res.status(200).json({ message: 'Avatar updated successfully', avatar: avatarPath });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating avatar', error });
//     }
// });

module.exports = router;
