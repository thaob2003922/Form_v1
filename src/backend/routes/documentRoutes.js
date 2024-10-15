const express = require('express');
const Document = require('../models/document');
const router = express.Router();

router.post(`/add_questions/:doc_id`, async (req, res) => {
    const docs_data = req.body;
    const docId = req.params.doc_id;
    console.log(docId);
    console.log(docs_data);

    try {
        // Kiểm tra xem tài liệu đã tồn tại chưa
        let questionData = await Document.findOne({ documentId: docId });

        if (!questionData) {
            // Nếu không tồn tại, tạo tài liệu mới
            questionData = new Document({
                documentId: docId,
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
    console.log("/data/:doc_id ", Date.now);
    const docId = req.params.doc_id;
    // console.log('docId: ' + docId);

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
                ]
            });
            await document.save(); // Lưu vào MongoDB
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
    try {
        const documents = await Document.find({}, { documentName: 1, documentId: 1 });
        console.log("documents from api", documents);
        res.send(documents);
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