import BookCategoryChart from '../../components/charts/BookCategoryChart'
import BorrowChart from '../../components/charts/MonthlyBookLoan'
export default function AdminDashBoard() {
  return (
    <div style={{ height: 'calc(100vh - 70px)', overflowY: 'auto', padding: '20px' }}>
  <div style={{ maxWidth: '900px', margin: '0 auto', marginBottom: '40px' }}>
    <BookCategoryChart />
  </div>
  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
    <BorrowChart />
  </div>
</div>

  );
}
