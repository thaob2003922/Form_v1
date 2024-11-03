const express = require('express');
const Document = require('../models/document');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    try {
        const user = await new Promise((resolve, reject) => {
            jwt.verify(token, 'your_jwt_secret', (err, user) => {
                if (err) return reject(err);
                resolve(user);
            });
        });
        req.currentUser = user; // Lưu trữ user vào req để sử dụng sau này
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Hàm xử lý lỗi
const handleError = (res, error, customMessage) => {
    console.error(error);
    res.status(500).json({ message: customMessage || 'An error occurred', error });
};

// Endpoint để thêm hoặc cập nhật câu hỏi
router.post(`/add_questions/:doc_id`, authenticateToken, async (req, res) => {
    const docs_data = req.body;
    const docId = req.params.doc_id;
    const currentUser = req.currentUser;

    try {
        let questionData = await Document.findOne({ documentId: docId });

        if (!questionData) {
            questionData = new Document({
                documentId: docId,
                userId: currentUser.id,
                questions: docs_data.questions || [],
                documentName: docs_data.document_name || "Untitled form",
                documentDescription: docs_data.doc_desc || "Add description"
            });
        } else {
            questionData.questions = docs_data.questions || questionData.questions;
            questionData.documentName = docs_data.document_name || questionData.documentName;
            questionData.documentDescription = docs_data.doc_desc || questionData.documentDescription;
            questionData.updateOn = Date.now();
        }

        await questionData.save();
        res.status(201).json({ message: 'Question added/updated successfully', questionData });
    } catch (error) {
        handleError(res, error, 'Error saving question');
    }
});

// Endpoint để lấy dữ liệu tài liệu
router.get("/data/:doc_id", authenticateToken, async (req, res) => {
    const docId = req.params.doc_id;
    const currentUser = req.currentUser;

    try {
        let document = await Document.findOne({ documentId: docId });

        if (!document) {
            document = new Document({
                documentId: docId,
                documentName: "Untitled form",
                documentDescription: "",
                questions: [
                    {
                        questionText: "",
                        questionType: "radio",
                        options: [{ optionText: " " }],
                        open: true,
                        required: false
                    }
                ],
                userId: currentUser.id
            });
            await document.save();
            console.log('Document created:', document);
        }

        res.send(document);
    } catch (error) {
        handleError(res, error, 'Error fetching the document');
    }
});

// Endpoint để lấy tất cả các document
router.get("/get_all_filenames", authenticateToken, async (req, res) => {
    const currentUser = req.currentUser;

    try {
        const documents = await Document.find({ userId: currentUser.id }, { documentName: 1, documentId: 1 });
        res.send({ documents });
    } catch (error) {
        handleError(res, error, 'Error fetching documents');
    }
});

// Endpoint để lấy 1 document
router.get("/get_document_by_id/:id", async (req, res) => {
    try {
        const docId = req.params.id;
        const document = await Document.findOne({ documentId: docId });
        if (!document) return res.status(404).send('Document not found');
        res.send(document);
    } catch (error) {
        handleError(res, error, 'Error fetching the document');
    }
});

// Endpoint để xóa document
router.delete('/delete_document/:doc_id', async (req, res) => {
    const docId = req.params.doc_id;

    try {
        const deletedDocument = await Document.findOneAndDelete({ documentId: docId });
        if (!deletedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json({ message: 'Document deleted successfully', deletedDocument });
    } catch (error) {
        handleError(res, error, 'Error deleting document');
    }
});

//Search
router.get('/search', authenticateToken, async (req, res) => {
    const { query } = req.query;
    const currentUser = req.currentUser; // Lấy thông tin người dùng hiện tại từ req
    console.log("Search query:", query);
    
    try {
        const documents = await Document.find({
            documentName: { $regex: query, $options: 'i' },
            userId: currentUser.id // Chỉ tìm tài liệu của người dùng hiện tại
        });

        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = router;