const express = require('express');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();
const multer = require('multer');
const path = require('path');


router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: 'User or email already exists' });

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Tìm người dùng bằng username hoặc email
        const user = await User.findOne({ $or: [{ username }, { email: username }] });

        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Tạo token JWT
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                email: user.email,
                role: user.role 
            }, 
            'your_jwt_secret', 
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
// Endpoint để lấy thông tin người dùng (bao gồm avatar)
router.get('/get-user', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(403).json({ message: 'Access denied, no token provided' });
        }

        const decoded = jwt.verify(token, 'your_jwt_secret'); 
        const user = await User.findById(decoded.id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Trả về thông tin người dùng bao gồm avatar
        res.json({
            username: user.username,
            avatarUrl: user.avatar, // Trả về avatarUrl
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user information' });
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

//Xác thực admin
const verifyAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Lấy token từ header
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden. Admins only.' });
        }
        req.user = decoded; // Lưu thông tin người dùng vào request
        next(); // Tiếp tục xử lý route
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
router.delete('/user/:id', verifyAdmin, async (req, res) => {
    try {
        // Xóa người dùng
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});
// Route để lấy tất cả người dùng (chỉ dành cho admin)
router.get('/all', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();  // Lấy tất cả người dùng từ CSDL
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users.' });
    }
});
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Đặt thư mục lưu trữ
    },
    filename: (req, file, cb) => {
        // Tạo tên file duy nhất bằng cách kết hợp timestamp và tên gốc
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Middleware để kiểm tra token (có thể thêm vào nếu cần xác thực)
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header Authorization
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    
    // Giải mã và xác thực token
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Lưu thông tin người dùng vào req.user
        req.user = decoded;
        console.log("Decoded token:", decoded); // Để kiểm tra thông tin sau khi giải mã

        next(); // Tiếp tục đến middleware hoặc route handler tiếp theo
    });

};

// API để upload avatar
router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const dirname = "http://localhost:8000/api/users/uploads"
    const avatarUrl = `${dirname}/${req.file.filename}`;// URL của ảnh vừa upload
    
    try {
        // Lưu avatar URL vào MongoDB cho người dùng
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,  // Dùng userId từ token
            { avatar: avatarUrl },  // Cập nhật avatar URL
            { new: true }  // Trả về đối tượng người dùng đã được cập nhật
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Avatar uploaded and saved successfully',
            avatarUrl,
            user: updatedUser 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

const dirname = "D:/luan_van/form/src/backend/"
// API để truy cập ảnh (có thể không cần API này nếu chỉ phục vụ tĩnh)
router.get('/uploads/:filename', (req, res) => {
    
    const filePath = path.join(dirname, 'uploads/', req.params.filename);
    res.sendFile(filePath);
});
// Cấu hình để Express phục vụ các file tĩnh (thư mục uploads)
router.use('/uploads', express.static(path.join(dirname, 'uploads')));


module.exports = router;
