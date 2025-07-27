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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { monthlyBookLoan } from "../../api/Admin-Dashboard";

// Đăng ký các thành phần cần dùng của Chart.js
ChartJS.register( LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const BorrowChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await monthlyBookLoan();
        const labels = data.map(item => item.month);        //Một mảng gồm các định dạng theo năm-tháng 'YYYY-MM'
        const counts = data.map(item => item.count);        // Số lượt mượn theo tháng

        setChartData({
          labels,
          datasets: [
            {
              label: "Lượt mượn",
              data: counts,
              borderColor: "#34c7f0ff",
              tension: 0.4, // đường cong mềm
              fill: true,
              pointBackgroundColor: "#8884d8"
            }
          ]
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
      }
    };

    fetchData(); //  React yêu cầu useEffect phải trả về undefined hoặc một hàm cleanup đồng bộ, không phải Promise nên phải gọi lại hàm này
  }, []);

  const options = {
    responsive: true, // Co dãn theo màn hình
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Số lượt mượn sách theo tháng" }
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { title: { display: true, text: "Tháng" } }
    }
  };

  if (!chartData) return <p>Đang tải biểu đồ...</p>;

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BorrowChart;
