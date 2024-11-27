const express = require('express');
const router = express.Router();
const Excel = require('exceljs');
const fs = require('fs');
const path = require('path');
const UserResponse = require('../models/user-response');
const jwt = require('jsonwebtoken');
const UserFormRelated = require('../models/userform-related');
const Document = require('../models/document');

router.post('/user_response/:doc_id', async (req, res) => {
    const docs_data = req.body;
    const name = req.params.doc_id; // Lấy tên tài liệu từ URL

    // Kiểm tra giá trị name trước khi sử dụng
    console.log('docs_data:', docs_data);
    console.log('name:', name);

    // Tạo workbook mới
    const workbook = new Excel.Workbook();
    const data = docs_data.answer_data;

    // Dùng tên tài liệu gốc (cẩn thận với ký tự không hợp lệ)
    const worksheet = workbook.addWorksheet(name); // Sử dụng tên gốc
    worksheet.columns = [{ header: "Time Stamp", key: "dateTime" }, ...docs_data.columns];

    worksheet.columns.forEach(column => {
        if (column.header) {
            column.width = column.header.length < 12 ? 12 : column.header.length;
        } else {
            column.width = 12; // Hoặc giá trị mặc định khác
        }
    });

    worksheet.getRow(1).font = { bold: true };

    data.forEach((e) => {
        worksheet.addRow(e);
    });

    const filePath = path.join(__dirname, `${name}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, (err) => {
        if (err) {
            console.error("Error downloading the file: ", err);
            res.status(500).send("Error downloading the file.");
        } else {
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting file: ", err);
            });
        }
    });
});

// Hàm để tải file Excel
router.get('/download/:doc_id', async (req, res) => {
    const docId = req.params.doc_id;
    // const filePath = path.join(__dirname, `${docId}.xlsx`); // Đảm bảo đường dẫn đúng
    const filePath = path.join('D:', 'luan_van', 'form', 'src', 'backend', 'files', `${docId}.xlsx`);
    console.log('docId:', docId);
    console.log('filePath:', filePath);

    // Kiểm tra xem file có tồn tại không
    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (err) {
                console.error("Error downloading the file: ", err);
                res.status(500).send("Error downloading the file.");
            }
            // Xóa file sau khi tải xong
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting file: ", err);
            });
        });
    } else {
        res.status(404).send("File not found.");
    }
});

// Hàm để lấy user response
const getUserResponse = async (userResponseId) => {
    try {
        return await UserResponse.findById(userResponseId);
    } catch (error) {
        console.error("Error fetching user response:", error);
        throw error; 
    }
};

// Endpoint để submit user response và trả về user response vừa tạo
router.post('/submit/:doc_id', async (req, res) => {
    const { answers } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    let currentUser;
    try {
        currentUser = await jwt.verify(token, 'your_jwt_secret');
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = currentUser.id;

    const userResponse = new UserResponse({
        userId,
        documentId: req.params.doc_id, // Thêm documentId vào userResponse
        answers,
    });

    try {
        await userResponse.save();
        const populatedResponse = await getUserResponse(userResponse._id); // Lấy user response đã được populate
        // res.status(201).json({ message: 'Answers saved successfully', userResponse: populatedResponse });

        console.log("userid:--", userId)
        console.log("documentId:-- ", req.params.doc_id)
        // Tim document by documentId
        let document = await Document.findOne({ documentId: req.params.doc_id });

        if (document) {
            // TODO CAP NHAT LAI related share form
            const updatedShareForm = await UserFormRelated.findOneAndUpdate(
                { userId, documentId: document._id }, // Điều kiện để tìm relatedShareForm
                { status: 'success' }, // Cập nhật status
                { new: true } // Trả về đối tượng mới sau khi cập nhật
            );

            console.log("updatedShareForm:--", updatedShareForm)
        }

        res.status(201).json({ message: 'Answers saved successfully', userResponse: populatedResponse });
    } catch (error) {
        console.error('Error saving answers:', error);
        res.status(500).json({ message: 'Error saving answers', error });
    }
});

router.get('/table/document/:docId', async (req, res) => {
    try {
        const userResponses = await UserResponse.find({ documentId: req.params.docId });

        if (!userResponses.length) {
            return res.status(404).json({ message: 'No responses found for this document' });
        }
        res.json(userResponses);
    } catch (error) {
        console.error("Error while getting user feedback:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/export/document/:docId', async (req, res) => {
    try {
        const userResponses = await UserResponse.find({ documentId: req.params.docId });
        if (!userResponses.length) {
            return res.status(404).json({ message: 'Không tìm thấy phản hồi nào cho tài liệu này' });
        }

        // Định dạng dữ liệu trước khi trả về
        const formattedResponses = userResponses.flatMap(item => {
            return Object.entries(item.answers).map(([question, answer]) => ({
                _id: item._id,
                userId: item.userId,
                submittedOn: item.submittedOn,
                question, 
                answer,   
            }));
        });

        res.json(formattedResponses);
    } catch (error) {
        console.error("Lỗi khi lấy phản hồi người dùng:", error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
