const express = require ('express');
const Document = require('../models/document');
const router = express.Router();

router.post(`/add_questions/:doc_id`, async (req, res) => {
    const docs_data = req.body;
    const docId = req.params.doc_id;
    console.log(docId);
    
    console.log(docs_data);

    try {
        // Kiểm tra xem tài liệu đã tồn tại chưa
        let questionData = await Document.findOne({ id_:docId });

        if (!questionData) {
            // Nếu không tồn tại, tạo tài liệu mới
            questionData = new Document({
                id_: docId,
                questions: docs_data.questions || [],
                documentName: docs_data.document_name || "Untitled form",
                documentDescription: docs_data.document_description || ""
            });
        } else {
            // Cập nhật tài liệu nếu đã tồn tại
            questionData.questions = docs_data.questions || questionData.questions;
            questionData.documentName = docs_data.document_name || questionData.documentName;
            questionData.documentDescription = docs_data.document_description || questionData.documentDescription;
            questionData.updateOn= Date.now();
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

    try {
        let document = await Document.findById({id_: docId});
        
        // Nếu không tồn tại, tạo document mới
        if (!document) {
            document = new Document({
                id_: docId,
                documentName: "Untitled form",
                documentDescription:"",
                questions: [
                    {
                        questionText: "",
                        questionType: "radio",
                        options: [
                            { optionText: "" },
                        ],
                        open: true,
                        required: false
                    }
                ]
            });
            await document.save(); // Lưu vào MongoDB
            console.log('Document created:', document);
        }else{
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
    try {
        const documents = await Document.find({}, { documentName: 1 }); // Lấy chỉ trường document_name
        res.send(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Error fetching documents.');
    }
});

module.exports = router;