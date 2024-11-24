const express = require('express');
const Document = require('../models/document');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ShareForm = require('../models/shareform');
const User = require('../models/user');
const UserFormRelated = require('../models/userform-related');
const UserResponse = require('../models/user-response');

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

// Route xử lý yêu cầu mời người dùng
router.put('/invite', authenticateToken, async (req, res) => {
    const { formId, invitees, accessLevel } = req.body;
    const currentUser = req.currentUser;  // Lấy thông tin người dùng từ token

    if (!formId || !invitees || !accessLevel) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const document = await Document.findOne({ documentId: formId });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        
        const updatedShareForm = await ShareForm.findOneAndUpdate(
            { documentId: formId },
            { accesstype: accessLevel, documentId: formId, invitees: invitees },
            { new: true, runValidators: true, upsert: true }
        )

        const shareFormURL = `/fill-form/${updatedShareForm._id}`;

        // -------------------------LÀM VIỆC Ở KHU VỰC NÀY-------------------------
        // LƯU Ý là accessLevel nếu là PUBLIC thì không cần làm đoạn này. Vì khi là PUBLIC thì không cần phải kiểm tra email của người dùng có hợp lệ hay không
        // VIỆC CẦN LÀM:
        /**
         * 0. Tạo một cái danh sách rỗng tên là validInvitees (danh sách này dùng để lưu CÁC USER CÓ EMAIL HỢP LỆ)
         * 1. Lấy danh sách invitees từ updatedShareForm.invitees
         * 2. Kiểm tra từng email trong danh sách invitees xem có tồn tại trong hệ thống không (Cái này đi hỏi ChatGPT là: Tôi có model User như này,
         * Tôi muốn kiếm tra từng email trong đây có phải là một User hợp lệ không, nếu hợp lệ thì thêm vào danh sách validInvitees)
         * Nếu không thì bỏ qua
         * 3. Sau khi kiểm tra xong hết. Thì lại hỏi chatGPT tiếp là: Tôi muốn tạo ra các relatedUserForm từ danh sách validInvitees này (mỗi User sẽ có một relatedUserForm)
         */

        // Trong quá trình này cũng hỏi ChatGPT là: Tôi muốn trong quá trình làm việc này nếu có xảy ra lỗi thì phải trả về lỗi gì đó cho người dùng.
        const validInvitees = [];
        const inviteeList = updatedShareForm.invitees || [];

        // const validInviteUsers = await User.find({email: {$in : inviteeList}})
        // console.log('validInviteUsers ', validInviteUsers)

        const bulkOperations = inviteeList.map(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                return {
                    insertOne: {
                        document: {
                            userId: user._id,
                            documentId: document._id,
                            shareFormURL: shareFormURL,
                            status: 'pending',
                        },
                    },
                };
            }
        });
        
        // Lọc bỏ các phần tử null hoặc undefined
        const operations = (await Promise.all(bulkOperations)).filter(op => op);
        
        await UserFormRelated.bulkWrite(operations);
        
        console.log('Bulk records created successfully.');
        // -------------------------LÀM VIỆC Ở KHU VỰC NÀY-------------------------

        res.status(200).json({
            message: 'Invitation sent successfully',
            shareFormURL: shareFormURL,
            shareForm: updatedShareForm,
            validInvitees: validInvitees
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Kiểm tra email người dùng có trong danh sách mời hay không
router.get('/check-access/:share_form_id', authenticateToken, async (req, res) => {
    //----- NEW CODE WITH AccessType and ShareForm
    const currentUser = req.currentUser;
    const shareFormId = req.params.share_form_id;
    const email = currentUser.email;

    try {
        const existingShareForm = await ShareForm.findById(shareFormId)
            .populate('accesstype');  // Populate thông tin từ collection 'AccessType';

        if (!existingShareForm) {
            console.error("Shareform not found: ", shareFormId);
            return res.status(404).send('Shareform not found: ' + shareFormId);
        }

        const existingDocument = await Document.findOne({
            documentId: existingShareForm.documentId
        })

        if(!existingDocument){
            res.status(404).json({ message: 'Document not found'});
        }

        const hasAcessRole = existingShareForm.invitees.includes(email) 
        || existingDocument.userId === currentUser.id.toString()
        || existingShareForm.accesstype.name === "PUBLIC";

        if (hasAcessRole) {
            res.status(200).json({ message: 'Accessed', document: existingDocument});
        }else{
            res.status(403).json({ message: 'Access denied'});
        }

    } catch (error) {
        console.error("Error finding document:", error);
        res.status(403).json({ message: 'Something went wrong when check access type', error});
    }
});


module.exports = router;