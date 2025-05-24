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
      const res = await searchBook({ searchTerm :searchTerm, 
                                     category : filterCategory });
      if (res.success) setBooks(res.data);
      else setAlertBox({ message: res.message, type: 'error' });
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
    }
  };

  // Xử lý thêm sách
  const handleAdd = async (data) => {
    try {
      const res = await addBook(data);
      if (res.success) {
       setAlertBox({ message: res.message, type: 'success' });
       return true;
      } else {  
        setAlertBox({ message: res.message, type: 'error' });
        return false;
      }
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
      return false;
    }
  };

// Xử lí cập nhật sách
const handleUpdate = async(data) =>{
  const res = await updateBook(data);
     try { 
      if (res.success) {
       setAlertBox({ message: res.message, type: 'success' });
       setSelectedBook(null)
       fetchBooks();
       console.log(res)
       return true;
      } else {  
        console.log(res )
        setAlertBox({ message: res.message, type: 'error' });
        return false;
      }
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
      return false;
    }
  }

  // Xử lý xoá sách
  const handleDelete = async (data) => {
      try {
        const res = await deleteBook({ book_id: data });
        if (res.success) {
          setAlertBox({ message: res.message, type: 'success' });
          setSelectedBook('')
          fetchBooks();
        } else {
          console.log(res)
          setAlertBox({ message: res.message, type: 'error' });
        }
      } catch (err) {
        console.error('Lỗi xoá sách:', err);
      }
    }


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
              <option value="Tất cả">Tất cả</option>
              <option value="Lập trình & Giải thuật">Lập trình & Giải thuật</option>
              <option value="An toàn thông tin">An toàn thông tin</option>
              <option value="Hệ thống máy tính & Mạng">Hệ thống máy tính & Mạng</option>
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
                <td className="text-center">{book.title}</td>
                <td className="text-center">{book.author_name}</td>
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
                      }}
                    >
                      ✏️ Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                       onClick={() => {
                        setCrudAction('delete');
                        setSelectedBook(book);
                      }}
                    >
                      🗑️ Xoá
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
       
       {/* Hiện modal thêm sách */}
        {crudAction === 'add' && (
          <AddBookModal
            show ={true}    // Trạng thái modal thêm sách mở 
            hide = {()=>setCrudAction('')} // Đóng modal lại khi click X
            addBook = {handleAdd}
          />
        )}

       {/* Hiện modal cập nhật sách */}
        {crudAction === 'update' && (
          <UpdateBookModal
            show = {true}
            hide = {()=>setCrudAction('')}
            handleUpdate = {handleUpdate}
            bookData={selectedBook}
          />
        )}

      {/* Hiện modal xóa sách */}
        {crudAction === 'delete' && (
          <DeleteBookModal
            show ={true}
            hide ={() => {
                           setCrudAction('');
                           setSelectedBook(null); 
                                }}
            bookData={selectedBook}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </Container>
  );
}

export default BookManagementPage;
