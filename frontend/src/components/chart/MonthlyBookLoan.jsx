import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { monthlyBookLoan } from "../../api/Admin-Dashboard";

// Đăng ký các thành phần cần dùng của Chart.js
ChartJS.register( LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title,Filler);

const BorrowChart = ({token}) => {
  const [chartData, setChartData] = useState(null);
  
  const gradientFill = (ctx, chartArea) => {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "rgba(0, 201, 255, 0.2)"); // xanh dưới
    gradient.addColorStop(1, "rgba(146, 254, 157, 0.0)"); // trong suốt lên trên
  return gradient;
    };
    useEffect(() => {
      const fetchData = async () => {
      try {
        const result = await monthlyBookLoan(token)
        const labels = result.data.map(item => item.month);        //Một mảng gồm các định dạng theo năm-tháng 'YYYY-MM'
        const counts = result.data.map(item => item.count);        // Số lượt mượn theo tháng
        setChartData({
          labels,
          datasets: [
            {
        label: "Borrowed",
        data: counts,
        borderColor: "#00C9FF",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ff6b6b",
        backgroundColor: (context) => {
        const { ctx, chartArea } = context.chart;
        if (!chartArea) return null; // tránh lỗi khi chart chưa render
        return gradientFill(ctx, chartArea);
      }
      }
    ]
  });
       }catch (error) {
        console.error("Error while getting chart data:", error);
      }
    };

    fetchData(); //  React yêu cầu useEffect phải trả về undefined hoặc một hàm cleanup đồng bộ, không phải Promise nên phải gọi lại hàm này
  }, []);

  const options = {
    responsive: true, // Co dãn theo màn hình
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Number of books borrowed per month" }
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { title: { display: true, text: "Month" } }
    }
  };

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BorrowChart;
