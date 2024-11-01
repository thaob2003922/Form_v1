import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ResponsesTable.css';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

const ResponsesTable = ({ docId, token }) => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/userResponse/table/document/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setResponses(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, [id, token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const exportToExcel = async () => {
        try {
            const formattedData = responses.map(response => {
                const rowData = { userId: response.userId, submittedOn: new Date(response.submittedOn).toLocaleString() };

                // Thêm các câu hỏi và câu trả lời vào rowData
                Object.entries(response.answers).forEach(([question, answer]) => {
                    rowData[question] = answer;
                });

                return rowData;
            });

            const ws = XLSX.utils.json_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Responses');

            XLSX.writeFile(wb, 'responses.xlsx');
        } catch (err) {
            console.error('Error exporting data to Excel:', err);
        }
    };

    // Tạo danh sách câu hỏi
    const questions = responses.length > 0 ? Object.keys(responses[0].answers) : [];

    return (
        <div>
            <button onClick={exportToExcel} className="export-button">
            <span className="button-text">Export to Excel</span>
                <DownloadIcon className='downloadIcon'/>
            </button>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        {questions.map((question, index) => (
                            <th key={index}>{question}</th>
                        ))}
                        <th>Submitted On</th>
                    </tr>
                </thead>
                <tbody>
                    {responses.map((response) => (
                        <tr key={response._id}>
                            <td>{response.userId}</td>
                            {questions.map((question) => (
                                <td key={question}>{response.answers[question]}</td>
                            ))}
                            <td>{new Date(response.submittedOn).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResponsesTable;