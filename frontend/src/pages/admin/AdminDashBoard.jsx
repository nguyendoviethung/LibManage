import BookCategoryChart from '../../components/charts/BookCategoryChart'
import BorrowChart from '../../components/charts/MonthlyBookLoan'
export default function AdminDashBoard() {
  return (
    <div style={{ padding: '20px', overflowY: 'auto', maxHeight: 'calc(100vh - 70px)' }}>
      <BookCategoryChart />
      <BorrowChart />
    </div>
  );
}
