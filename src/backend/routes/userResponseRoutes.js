const express = require('express');
const router = express.Router();


const cleanWorksheetName = (name) => {
    const invalidChars = /[\\*?":/[\]]/g; // Ký tự không hợp lệ
    return name.replace(invalidChars, ''); // Thay thế bằng chuỗi rỗng
};
router.post('/user_response/:doc_id', async (req, res) => {
    const docs_data = req.body;
    const name = req.params.doc_id;
    const cleanedName = cleanWorksheetName(name); 

    const workbook = new Excel.Workbook();
    const data = docs_data.answer_data;

    const worksheet = workbook.addWorksheet(cleanedName);

    worksheet.columns = [{ header: "Time Stamp", key: "dateTime" }, ...docs_data.columns];
    
    worksheet.columns.forEach(column => {
        column.width = column.header.length < 12 ? 12 : column.header.length;
    });

    worksheet.getRow(1).font = { bold: true };

    data.forEach((e, index) => {
        worksheet.addRow(e);
    });

    const filePath = `${cleanedName}.xlsx`;
    await workbook.xlsx.writeFile(filePath);
    
    res.download(filePath, (err) => {
        if (err) {
            console.error("Error downloading the file: ", err);
            res.status(500).send("Error downloading the file.");
        }
    });
});

module.exports = router;