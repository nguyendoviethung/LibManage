// Số lượng sách từng thể loại 
fetch('Number-of-books-by-genre.php')
  .then(response => response.json())
  .then(data => {
    const genres = data.map(item => item.genre);
    const bookCounts = data.map(item => item.total_books);
    const ctx = document.getElementById('chart1').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: genres,
        datasets: [{
          label: 'Số lượng sách theo thể loại',
          data: bookCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  });
