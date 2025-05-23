import { useState, useEffect } from 'react';
import { Container, Button, Table, Form } from 'react-bootstrap';
import AlertBox from '../alert-box/AlertBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  listBook,
  searchBook,
  addBook,
  updateBook,
  deleteBook
} from '../../api/BookManagementAPI';
import AddBookModal from './AddBookModal';
import UpdateBookModal from './UpdateBookModal';
import DeleteBookModal from './DeleteBookModal';
import './BookManagement.scss';

function BookManagementPage() {
  const [books, setBooks] = useState([]); // Mảng sách được in ra màn hình
  const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal
  const [crudAction, setCrudAction] = useState(null); // Tên hành động CRUD
  const [selectedBook, setSelectedBook] = useState(null); // Sách được chọn
  const [alertBox, setAlertBox] = useState(null); // Thông báo
  const [searchTerm, setSearchTerm] = useState(''); // Input tìm kiếm
  const [filterCategory, setFilterCategory] = useState('Tất cả'); // Bộ lọc thể loại

  // Lấy danh sách sách khi tải trang
  const fetchBooks = async () => {
    try {
      const res = await listBook();
      if (res.success) setBooks(res.data);
      else {
        setBooks([]);
        setAlertBox({ message: res.message, type: 'error' });
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách sách:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = async () => {
    try {
      const res = await searchBook({ searchTerm, category: filterCategory });
      if (res.success) setBooks(res.data);
      else setAlertBox({ message: res.message, type: 'error' });
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
    }
  };

  // Xử lý xoá sách
  const handleDelete = async (bookID) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá sách này không?')) {
      try {
        const res = await deleteBook({ book_id: bookID });
        if (res.success) {
          setAlertBox({ message: res.message, type: 'success' });
          fetchBooks();
        } else {
          setAlertBox({ message: res.message, type: 'error' });
        }
      } catch (err) {
        console.error('Lỗi xoá sách:', err);
      }
    }
  };

  return (
    <Container className="mt-4">
      <div className="book-management">
        {alertBox && (
          <AlertBox
            message={alertBox.message}
            type={alertBox.type}
            onClose={() => setAlertBox(null)}
          />
        )}

        {/* Thanh tìm kiếm và bộ lọc */}
        <div className="search-bar-container mb-3">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Tìm kiếm theo tên sách hoặc mã"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="action-buttons">
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="Tất cả">Tất cả thể loại</option>
              <option value="Lập trình">Lập trình</option>
              <option value="AI">AI</option>
              <option value="Thiết kế">Thiết kế</option>
              <option value="Văn học">Văn học</option>
            </Form.Select>

            <Button
              variant="primary"
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
            <Button
              variant="success"
              onClick={() => {
                setCrudAction('add');
                setSelectedBook(null);
                setShowModal(true);
              }}
            >
              Thêm sách
            </Button>
          </div>
        </div>

        {/* Bảng hiển thị sách */}
        <Table striped bordered hover responsive className="custom-table">
          <thead>
            <tr>
              <th className="text-center">STT</th>
              <th className="text-center">Mã sách</th>
              <th className="text-center">Tên sách</th>
              <th className="text-center">Tác giả</th>
              <th className="text-center">Ngôn ngữ</th>
              <th className="text-center">Năm xuất bản</th>
              <th className="text-center">Vị trí</th>
              <th className="text-center">Số lượng</th>
              <th className="text-center">Thể loại</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.book_id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{book.book_id}</td>
                <td>{book.title}</td>
                <td>{book.author_name}</td>
                <td className="text-center">{book.lang}</td>
                <td className="text-center">{book.publisher_year}</td>
                <td className="text-center">{book.location}</td>
                <td className="text-center">{book.quantity}</td>
                <td className="text-center">{book.genre}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => {
                        setCrudAction('update');
                        setSelectedBook(book);
                        setShowModal(true);
                      }}
                    >
                      ✏️ Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(book.book_id)}
                    >
                      🗑️ Xoá
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {crudAction === 'add' && (
          <AddBookModal
            show={showModal}
            hide={() => setShowModal(false)}
            setAlertBox={setAlertBox}
          />
        )}

        {crudAction === 'update' && (
          <UpdateBookModal
            show={showModal}
            hide={() => setShowModal(false)}
            setAlertBox={setAlertBox}
            bookData={selectedBook}
          />
        )}

        {crudAction === 'delete' && (
          <DeleteBookModal
            show={showModal}
            hide={() => setShowModal(false)}
            setAlertBox={setAlertBox}
            bookData={selectedBook}
          />
        )}
      </div>
    </Container>
  );
}

export default BookManagementPage;
