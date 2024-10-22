const express = require('express');
const router = express.Router();
const Excel = require('exceljs');
const fs = require('fs');
const path = require('path');
const UserResponse = require('../models/user-response');

const cleanWorksheetName = (name) => {
    const invalidChars = /[\\*?":/[\]]/g; // Ký tự không hợp lệ
    return name.replace(invalidChars, ''); 
};

router.post('/user_response/:doc_id', async (req, res) => {
    const docs_data = req.body;
    const name = req.params.doc_id; // Lấy tên tài liệu từ URL

    // Kiểm tra giá trị name trước khi sử dụng
    console.log('docs_data:', docs_data);
    console.log('name:', name);

    // Làm sạch tên tài liệu
    const cleanedName = cleanWorksheetName(name);

    const workbook = new Excel.Workbook();
    const data = docs_data.answer_data;

    const worksheet = workbook.addWorksheet(cleanedName); // Sử dụng tên đã làm sạch
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

    const filePath = path.join(__dirname, `${cleanedName}.xlsx`); 
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
    const cleanedName = cleanWorksheetName(docId);
    const filePath = path.join(__dirname, `${cleanedName}.xlsx`); // Đảm bảo đường dẫn đúng

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

// Cập nhật router với doc_id
router.post('/submit/:doc_id', async (req, res) => {
    const docId = req.params.doc_id; // Lấy doc_id từ URL
    const { userId, answers } = req.body; // Lấy userId và answers từ body

    // Tạo một bản ghi mới
    const newResponse = new UserResponse({
        documentId: docId, // Sử dụng docId từ params
        userId,
        answers,
    });

    try {
        await newResponse.save(); // Lưu vào MongoDB
        res.status(201).send('Answers submitted successfully.');
    } catch (err) {
        console.error("Error saving answers: ", err);
        res.status(500).send("Error saving answers.");
    }
});


module.exports = router;
