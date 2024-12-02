const express = require('express');
const router = express.Router();
const Excel = require('exceljs');
const fs = require('fs');
const path = require('path');
const UserResponse = require('../models/user-response');
const jwt = require('jsonwebtoken');
const UserFormRelated = require('../models/userform-related');
const Document = require('../models/document');

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
