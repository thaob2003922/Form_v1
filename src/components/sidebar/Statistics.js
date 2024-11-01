import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Statistics = () => {
  const [formCount, setFormCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [hoursVisited, setHoursVisited] = useState(0); // State cho số giờ truy cập
  const [data, setData] = useState([]);

  useEffect(() => {
    setVisitCount(prevCount => prevCount + 1);
    // Cập nhật số giờ truy cập (giả sử mỗi lần truy cập là 1 giờ)
    setHoursVisited(prevHours => prevHours + 1);
  }, []);

  const handleFormSubmit = () => {
    setFormCount(prevCount => prevCount + 1);
    // Cập nhật dữ liệu cho biểu đồ
    const newDataPoint = {
      name: `Day ${data.length + 1}`,
      formCount: formCount + 1,
      visitCount: visitCount,
      hoursVisited: hoursVisited, // Thêm số giờ vào dữ liệu
    };
    setData(prevData => [...prevData, newDataPoint]);
  };

  return (
    <div>
      <h1>Thống kê</h1>
      <p>Số lượng tạo form: {formCount}</p>
      <p>Số lượng truy cập web: {visitCount}</p>
      <p>Số giờ truy cập web: {hoursVisited}</p> {/* Hiển thị số giờ truy cập */}

      <form onSubmit={(e) => {
        e.preventDefault();
        handleFormSubmit();
      }}>
        <button type="submit">Tạo Form</button>
      </form>

      <h2>Biểu đồ thống kê</h2>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="formCount" fill="#D6D7F2" />
        <Bar dataKey="visitCount" fill="#2A95BF" />
        <Bar dataKey="hoursVisited" fill="#73C6D9" /> {/* Thêm cột cho số giờ truy cập */}
      </BarChart>
    </div>
  );
};

export default Statistics;
