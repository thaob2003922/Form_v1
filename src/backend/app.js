const fs = require('fs')
const path = require('path')
const express= require('express')
const app = express()
const Excel = require('exceljs')
const jwt = require('jsonwebtoken');
var cors = require('cors')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())
app.use(function(req,res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// app.post(`/add_questions/:doc_id`,(req,res)=>{
//     var docs_data = req.body;
//     var name = req.params.doc_id;
//     console.log(docs_data);
//     let data = JSON.stringify(docs_data);
//     fs.writeFileSync(`files/${name}.json`, data);
// })
// app.get("/data/:doc_id",(req, res)=>{
//     var docId = req.params.doc_id;
//     var filePath = path.join(__dirname, `files/${docId}.json`);

//     if (!fs.existsSync(filePath)) {
//         // Nếu không tồn tại, tạo file mới với dữ liệu mong muốn
//         const initialData = {
//             document_name: "Untitled form",
//             questions: [
//                 {
//                     questionText: "How do you feel today?",
//                     questionType: "radio",
//                     options: [
//                         { optionText: "Good" },
//                         { optionText: "Bad" },
//                         { optionText: "Okay" }
//                     ],
//                     open: true,
//                     required: false
//                 }
//             ]
//         };

//         fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2)); // Ghi dữ liệu vào file
//         console.log('File created:', docId);
//     }

//     fs.readFile(`files/${docId}.json`,(err, data)=>{
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Error reading the file.');
//         }

//         let ques_data;
//         try {
//             ques_data = JSON.parse(data);
//         } catch (parseError) {
//             console.error(parseError);
//             return res.status(500).send('Error parsing JSON data.');
//         }

//         console.log(req.params.doc_id);
//         res.send(ques_data);
//     });
// })

// app.get("/get_all_filenames",(req, res)=>{
//     const directoryPath = path.join(__dirname, '/files');
//     fs.readdir(directoryPath, function(err, files){
//         if(err) {
//             return console.log('Unable to scan directory: ' +err);   
//         }
//         res.send(files);
//     })
// })


//excel
app.post(`/user_response/:doc_id`,(req, res)=>{
    var docs_data = req.body;
    var name = req.params.doc_id;
    let workbook = new Excel.Workbook()
    var data = req.body.answer_data;
    let worksheet = workbook.addWorksheet(`${name}`)

    worksheet.columns = [{header:"Time Stamp", key:"dateTime"},...docs_data.columns]
    worksheet.columns.forEach(column =>{
        column.width = column.header.length < 12 ? 12 : column.header.length
    })
    worksheet.getRow(1).font = {hold: true}
    data.forEach((e, index)=>{
        const rowIndex = index + 2
        worksheet.addRow({
            d,...e
        })
    })
    workbook.xlsx.writeFile(`${name}.xlsx`)
    
})
// //for use authentication
// const authorization = 'authorization';
// app.use((req, res, next)=>{
//     const authHeader= req.get(authorization);
//     if(!authHeader){
//         request.isUserAuth = false;
//         return next();
//     }

// const token = authHeader;
// const secret_key ='secret_key';
// let decodedToken;
// try{
//     decodedToken = JSON.jwt.verify(token, secret_key);
// }catch(err){
//     request.isUserAuth = false;
//     return next();
// }
// if(!decodedToken){
//     request.isUserAuth = false;
//     return next();
// }
// req.id= decodedToken.id;
// req.isUserAuth= true;
// next();
// });


//mongodb
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/WWPigeon")
.then(()=>{
    console.log("mongodb connect");
})
.catch(()=>{
    console.log("failed to connect");  
})
app.use(express.json());
const userRoutes = require('./routes/userRoutes.js');
app.use('/api/users', userRoutes);

const documentRoutes = require('./routes/documentRoutes.js');
app.use('/api/documents', documentRoutes);

app.listen(8000,()=>{
    console.log("port connected");
})