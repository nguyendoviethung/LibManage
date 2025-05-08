// src/components/BookCategoryChart.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';  // 👉 THÊM axios
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

// Đăng ký các thành phần cần dùng của chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

function BookCategoryChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
      // Gọi API để lấy dữ liệu
        const response = await axios.get('http://localhost/LibManage/api/chart/number-of-books-by-genre.php');
        //Lấy dữ liệu từ API và gán vào biến dataFromAPI
        const dataFromAPI = response.data; 

        const labels = dataFromAPI.map(item => item.genre); //Lấy tên thể loại từ dữ liệu API
        const counts = dataFromAPI.map(item => item.total_books); //Lấy số lượng sách từ dữ liệu API

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Books',
              data: counts,
              backgroundColor: 'rgba(200, 158, 169, 0.7)',
              borderColor: 'rgb(110, 191, 191)',
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Number of Books per Category' }
    }
  };

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default BookCategoryChart;
