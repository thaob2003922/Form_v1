const express = require('express');
const Document = require('../models/document');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user; // Gán thông tin người dùng vào req
        next();
    });
};

router.post(`/add_questions/:doc_id`, async (req, res) => {
    const docs_data = req.body;
    const docId = req.params.doc_id;
    let currentUser;
    // const token = req.headers['authorization'];
    console.log('request /add_questions/:doc_id---',req.headers );
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('token /add_questions/:doc_id---',token );
    try {
        // Sử dụng Promise để chờ jwt.verify
        currentUser = await new Promise((resolve, reject) => {
            jwt.verify(token, 'your_jwt_secret', (err, user) => {
                if (err) {
                    return reject(err);
                }
                resolve(user);
            });
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(403).json({ message: 'Invalid token' });
    }

    if (!currentUser.id) {
        return res.status(403).json({ message: 'User not found' });
    }
    try {
        // Kiểm tra xem tài liệu đã tồn tại chưa
        let questionData = await Document.findOne({ documentId: docId });
        if (!questionData) {
            // Nếu không tồn tại, tạo tài liệu mới
            questionData = new Document({
                documentId: docId,
                userId: currentUser.id,
                questions: docs_data.questions || [],
                documentName: docs_data.document_name || "Untitled form",
                documentDescription: docs_data.doc_desc || "Add description"
            });
        } else {
            // Cập nhật tài liệu nếu đã tồn tại
            questionData.questions = docs_data.questions || questionData.questions;
            questionData.documentName = docs_data.document_name || questionData.documentName;
            questionData.documentDescription = docs_data.doc_desc || questionData.documentDescription;
            questionData.updateOn = Date.now();
        }

        await questionData.save();
        res.status(201).json({ message: 'Question added/updated successfully', questionData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving question', error });
    }
});

router.get("/data/:doc_id", async (req, res) => {
    const docId = req.params.doc_id;
    // console.log('docId: ' + docId);
    // let currentUser;
    // const token = req.headers['authorization'];
    // console.log('token /data/:doc_id ----', token);

    // if (!token) return res.status(401).json({ message: 'No token provided' })
    // jwt.verify(token, 'your_jwt_secret', (err, user) => {
    //     if (err) {
    //         if (err.name === 'TokenExpiredError') {
    //             return res.status(401).json({ message: 'Token has expired' });
    //         }
    //         return res.status(403).json({ message: 'Invalid token' });
    //     }
    //     console.log('/data/:doc_id:------ ' );
    //     console.log('user from token ', user);
    //     currentUser = user;
    // });
    // console.log('/data/:doc_id:currentUser ------ ' );
    // if(!currentUser.id) {
    //     return res.status(403).json({ message: 'User not found' });
    // }

    // console.log('currentUser.id = ', currentUser.id);

    // try {
    //     let document = await Document.findOne({ documentId: docId });

    //     // Nếu không tồn tại, tạo document mới
    //     if (!document) {
    //         document = new Document({
    //             documentId: docId,
    //             documentName: "Untitled form",
    //             documentDescription: "",
    //             questions: [
    //                 {
    //                     questionText: "",
    //                     questionType: "radio",
    //                     options: [
    //                         { optionText: " " },
    //                     ],
    //                     open: true,
    //                     required: false
    //                 }
    //             ],
    //             userId: currentUser.id
    //         });
    //         await document.save(); // Lưu vào MongoDB
    //         console.log('Document created:', document);
    //     } else {
    //         console.log('Document found:', document);

    //     }

    //     res.send(document);
    // } catch (error) {
    //     console.error(error);
    //     return res.status(500).send('Error fetching the document.');
    // }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let currentUser;
    try {
        // Sử dụng Promise để chờ jwt.verify
        currentUser = await new Promise((resolve, reject) => {
            jwt.verify(token, 'your_jwt_secret', (err, user) => {
                if (err) {
                    return reject(err);
                }
                resolve(user);
            });
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(403).json({ message: 'Invalid token' });
    }

    if (!currentUser.id) {
        return res.status(403).json({ message: 'User not found' });
    }
    console.log('currentUser.id /data/:doc_id----', currentUser.id);


    try {
        let document = await Document.findOne({ documentId: docId });

        // Nếu không tồn tại, tạo document mới
        if (!document) {
            document = new Document({
                documentId: docId,
                documentName: "Untitled form",
                documentDescription: "",
                questions: [
                    {
                        questionText: "",
                        questionType: "radio",
                        options: [
                            { optionText: " " },
                        ],
                        open: true,
                        required: false
                    }
                ],
                userId: currentUser.id // Bây giờ currentUser.id sẽ có giá trị
            });
            await document.save();
            console.log('Document created:', document);
        } else {
            console.log('Document found:', document);
        }

        res.send(document);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching the document.');
    }
});

// Endpoint để lấy tất cả các document
router.get("/get_all_filenames", async (req, res) => {
    let currentUser;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try {

        console.log('req.headers', req.headers);

        // const token = req.headers['authorization'];
        console.log('token /get_all_filenames----', token);

        if (!token) return res.status(401).json({ message: 'No token provided' });
        jwt.verify(token, 'your_jwt_secret', (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token has expired' });
                }
                return res.status(403).json({ message: 'Invalid token' });
            }
            console.log('user from token /get_all_filenames----');
            console.log('user from token ', user);
            currentUser = user;
        });
        console.log('end of jwt.verify /get_all_filenames---- ');

        // const userId = req.user.id; // Đảm bảo userId đã có trong token
        // console.log('userId: ' + userId);

        const documents = await Document.find({userId: currentUser.id},{ documentName: 1, documentId: 1 });
        console.log("documents from api", documents);
        // Lấy userId từ req.user
        res.send({ documents }); // Gửi documents và userId
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Error fetching documents.');
    }
});

// Endpoint để lấy 1 document
router.get("/get_document_by_id/:id", async (req, res) => {
    // console.log("/get_document_by_id/:id ", Date.now);
    try {
        const docId = req.params.id;

        const document = await Document.findOne({ documentId: docId });
        if (!document) {
            return res.status(404).send('Document not found');
        }
        res.send(document);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Error fetching documents.');
    }
});

//Delete
router.delete('/delete_document/:doc_id', async (req, res) => {
    const docId = req.params.doc_id;
    console.log('docId deleted', docId);

    try {
        const deletedDocument = await Document.findOneAndDelete({ documentId: docId });
        console.log('delete document', deletedDocument);


        if (!deletedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({ message: 'Document deleted successfully', deletedDocument });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting document', error });
    }
});

module.exports = router;