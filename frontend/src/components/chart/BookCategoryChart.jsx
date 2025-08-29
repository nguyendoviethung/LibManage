import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { bookCategoryChart } from '../../api/Admin-Dashboard';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

function BookCategoryChart({ token, theme = "vibrant" }) {
  const [chartData, setChartData] = useState(null);
  
  const themes = {
    pastel: [
      "rgba(255, 179, 186, 0.7)",
      "rgba(255, 223, 186, 0.7)",
      "rgba(186, 255, 201, 0.7)",
      "rgba(186, 225, 255, 0.7)",
      "rgba(218, 186, 255, 0.7)"
    ],
    vibrant: [
      "rgba(54, 162, 235, 0.8)", // xanh dương
      "rgba(255, 99, 132, 0.8)", // hồng
      "rgba(255, 206, 86, 0.8)", // vàng
      "rgba(75, 192, 192, 0.8)", // xanh ngọc
      "rgba(153, 102, 255, 0.8)", // tím
      "rgba(255, 159, 64, 0.8)"  // cam
    ],
    dark: [
      "rgba(29, 78, 216, 0.8)",  // xanh navy
      "rgba(220, 38, 38, 0.8)",  // đỏ đậm
      "rgba(202, 138, 4, 0.8)",  // vàng đất
      "rgba(22, 163, 74, 0.8)",  // xanh lá
      "rgba(126, 34, 206, 0.8)", // tím đậm
      "rgba(234, 88, 12, 0.8)"   // cam cháy
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await bookCategoryChart(token);
        const labels = result.data.map(item => item.genre);
        const counts = result.data.map(item => item.total_books);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of books',
              data: counts,
              backgroundColor: themes[theme],
              borderColor: themes[theme].map(c => c.replace("0.8", "1")), // viền đậm
              borderWidth: 2,
              borderRadius:4  // Bo góc cột -> trẻ trung
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [token, theme]);

  const options = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'top',
        labels: { font: { size: 14, weight: "500" } }
      },
      title: { 
        display: true, 
        text: 'Number of books by genre',
        font: { size: 18, weight: "bold" },
        color: "#333"
      }
    },
    scales: {
      x: { 
        ticks: { font: { size: 13 } }, 
        grid: { display: false }
      },
      y: { 
        ticks: { font: { size: 13, weight: "500" }, stepSize: 1 }, 
        grid: { color: "#eee" }
      }
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
