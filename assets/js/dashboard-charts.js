// BIểu đồ cho số lượng sách từng thể loại 
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
