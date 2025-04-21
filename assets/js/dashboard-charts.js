// 1. Biểu đồ cột cho số lượng sách từng thể loại 

fetch('.../../api/chart/number-of-books-by-genre.php') // Gửi yêu cầu đến API để lấy dữ liệu
  .then(response => response.json())
  .then(data => {
    const genres = data.map(item => item.genre);   // Lấy tên thể loại từ dữ liệu
    const bookCounts = data.map(item => item.total_books); // Lấy số lượng sách từ dữ liệu
    const ctx = document.getElementById('chart1').getContext('2d'); // Lấy ngữ cảnh của canvas
    new Chart(ctx, { 
      type: 'bar', // Loại biểu đồ là cột
      data: { 
        labels: genres,   // Nhãn cho các cột là tên thể loại
        datasets: [{
          label: 'Số lượng sách theo thể loại',  // Nhãn cho biểu đồ
          data: bookCounts,    // Dữ liệu cho biểu đồ là số lượng sách
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }  // Bắt đầu trục y từ 0
        }
      }
    });
  });

// 2. Biểu đồ tròn cho số lượng người đang hoạt động
fetch('.../../api/chart/number-of-active-users.php')
  .then(response => response.json())
  .then(data => {
    const quantity = data.map(item => item.quantity);
    const status_type = data.map(item => item.status);
    const ctx = document.getElementById('chart2').getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: status_type, // nhãn cho các phần của biểu đồ là trạng thái người dùng
        datasets: [{
          label: 'Số lượng người dùng', // nhãn cho biểu đồ khi người dùng trỏ vào thì hiện ra 
          data: quantity, // dữ liệu cho biểu đồ là số lượng người dùng theo trạng thái
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',    // màu cho "active"
            'rgba(255, 99, 132, 0.2)',    // màu cho "disabled"
            'rgba(255, 205, 86, 0.2)'     // màu cho "banned" (nếu có)
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)', // màu viền cho "active"
            'rgba(255, 99, 132, 1)', // màu viền cho "disabled"
            'rgba(255, 205, 86, 1)'  // màu viền cho "banned" (nếu có)
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Biểu đồ số lượng người dùng theo trạng thái'
          }
        }
      }
    });
  });
