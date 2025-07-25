import { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Spinner } from 'react-bootstrap';
import AlertBox from '../../components/alert-box/AlertBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faPenToSquare, faTrash, faSearch, faPlus,faFilter, faUser, faCalendar, faGlobe} from '@fortawesome/free-solid-svg-icons';
import {
  listBook,
  searchBook,
  addBook,
  updateBook,
  deleteBook
} from '../../api/BookManagementAPI';
import AddBookModal from '../../components/book-modal/AddBookModal';
import UpdateBookModal from '../../components/book-modal/UpdateBookModal';
import DeleteBookModal from '../../components/book-modal/DeleteBookModal';
import defaultBookCover from '../../assets/images/default-book-cover.png';
import './BookManagement.scss';
import Filter from '../../components/filter/Filter.jsx';
import Search from '../../components/search-bar/Search.jsx';
import ActionButton from '../../components/action-button/ActionButton.jsx';

function BookManagement() {
  const [books, setBooks] = useState([]); // Mảng sách được in ra màn hình
  const [crudAction, setCrudAction] = useState(null); // Tên hành động CRUD
  const [selectedBook, setSelectedBook] = useState(null); // Sách được chọn
  const [alertBox, setAlertBox] = useState(null); // Thông báo
  const [searchTerm, setSearchTerm] = useState(''); // Input tìm kiếm
  const [filterCategory, setFilterCategory] = useState('Tất cả'); // Bộ lọc thể loại
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8; // Số sách hiển thị trên mỗi trang
  const totalPages = Math.ceil(books.length / booksPerPage);
  // Sắp xếp
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  // Filter nâng cao
  const [filterAuthor, setFilterAuthor] = useState('Tất cả')
  const [filterYear, setFilterYear] = useState('Tất cả');
  const [filterLang, setFilterLang] = useState('Tất cả');
  const [loading, setLoading] = useState(false);

  // Modal chi tiết sách
  const [detailModal, setDetailModal] = useState(false);
  const [detailBook, setDetailBook] = useState(null);

  // Lấy danh sách giá trị duy nhất cho filter
  const uniqueAuthors = ['Tất cả', ...Array.from(new Set(books.map(b => b.author_name).filter(Boolean)))];
  const uniqueYears = ['Tất cả', ...Array.from(new Set(books.map(b => b.publisher_year).filter(Boolean)))];
  const uniqueLangs = ['Tất cả', ...Array.from(new Set(books.map(b => b.lang).filter(Boolean)))];
  const uniqueCategories = ['Tất cả',  ...Array.from(new Set(books.map(b => b.genre).filter(Boolean)))];
  // Hàm lọc nâng cao
  const getFilteredBooks = () => {
    return books.filter(book => {
      const matchAuthor = filterAuthor === 'Tất cả' || book.author_name === filterAuthor;
      const matchYear = filterYear === 'Tất cả' || String(book.publisher_year) === String(filterYear);
      const matchLang = filterLang === 'Tất cả' || book.lang === filterLang;
      const matchCategory = filterCategory === 'Tất cả' || book.genre === filterCategory;
      const matchSearch = !searchTerm || book.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
      return matchAuthor && matchYear && matchLang && matchCategory && matchSearch;
    });
  };

  // Sắp xếp và phân trang dựa trên books đã lọc
  const filteredBooks = getFilteredBooks(); // Sách đã được lọc 
  const sortedBooks = getSortedBooks(filteredBooks); // Sách đã được sắp xếp
  const paginatedBooks = sortedBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Đảo chiều
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: '', direction: '' }; // Bỏ sắp xếp
      }
      return { key, direction: 'asc' };
    });
  };
  
  // Hàm để hiển thị biểu tượng sắp xếp
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} style={{marginLeft: 4, opacity: 0.5}} />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} style={{marginLeft: 4, color: '#1e9ddc'}} />;
    if (sortConfig.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} style={{marginLeft: 4, color: '#1e9ddc'}} />;
    return null;
  };

  // Lấy danh sách sách khi tải trang
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await listBook();
      if (res.success) setBooks(res.data);
      else {
        setBooks([]);
        setAlertBox({ message: res.message, type: 'error' });
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách sách:', err);
    } finally {
      setLoading(false);
    }
  };
 
  // Gọi hàm lấy sách khi component mount và khi có thay đổi về sách
  useEffect(() => {
    fetchBooks();
  }, []);

  // Reset về trang 1 khi tìm kiếm/filter
  useEffect(() => {
    setCurrentPage(1);
  }, [books]);
  
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

  // Sửa getSortedBooks để nhận tham số books
  function getSortedBooks(inputBooks) {
    let sorted = [...inputBooks];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === 'publisher_year' || sortConfig.key === 'quantity') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else {
          aValue = aValue ? aValue.toString().toLowerCase() : '';
          bValue = bValue ? bValue.toString().toLowerCase() : '';
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
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
  <div div className="search-bar-container ">

    <div className="filter-row">
      {/* Bộ lọc thể loại sách */}
      <Filter
        icon={faFilter}
        filterTitle= "Lọc theo thể loại sách"
        filterName={filterCategory}
        setFilter={setFilterCategory}
        uniqueKeyword={uniqueCategories}
      />

      {/* Bộ lọc tác giả */}
      <Filter
        icon={faUser}
        filterTitle="Lọc theo tác giả"
        filterName={filterAuthor}
        setFilter={setFilterAuthor}
        uniqueKeyword={uniqueAuthors}
      />

      {/* Bộ lọc năm xuất bản */}
      <Filter
        icon={faCalendar}
        filterTitle="Lọc theo năm xuất bản"
        filterName={filterYear}
        setFilter={setFilterYear}
        uniqueKeyword={uniqueYears}
      />

      {/* Bộ lọc ngôn ngữ */}
      <Filter
        icon={faGlobe}
        filterTitle="Lọc theo ngôn ngữ"
        filterName={filterLang}
        setFilter={setFilterLang}
        uniqueKeyword={uniqueLangs}
      />
    </div>

    <div className="search-row" >
      <div>
        <Search
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          placeholder="Tìm kiếm sách theo tên"
        />
      </div>
      <ActionButton
        onClick={handleSearch}
        label="Tìm kiếm"
        icon={faSearch}
        className="btn-custom-search"
      />
      <ActionButton
        onClick={() => {
          setCrudAction('add');
          setSelectedBook(null);
        }}
        label="Thêm sách"
        icon={faPlus}
        className="btn-custom-add-book"
      />
    </div>
  </div>

   <div className="table-scroll-wrapper">
        {/* Bảng hiển thị sách */}
        <Table striped bordered hover responsive className="custom-table">
          <thead>
            <tr>
              <th className="text-center">STT</th>
              <th className="text-center">Mã sách</th>
              <th className="text-center sort-col" style={{cursor:'pointer'}} onClick={() => handleSort('title')}>
                Tên sách {renderSortIcon('title')}
              </th>
              <th className="text-center sort-col" style={{cursor:'pointer'}} onClick={() => handleSort('author_name')}>
                Tác giả {renderSortIcon('author_name')}
              </th>
              <th className="text-center">Ngôn ngữ</th>
              <th className="text-center sort-col" style={{cursor:'pointer'}} onClick={() => handleSort('publisher_year')}>
                Năm xuất bản {renderSortIcon('publisher_year')}
              </th>
              <th className="text-center">Vị trí</th>
              <th className="text-center sort-col" style={{cursor:'pointer'}} onClick={() => handleSort('quantity')}>
                Số lượng {renderSortIcon('quantity')}
              </th>
              <th className="text-center">Thể loại</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Spinner animation="border" variant="primary" style={{ width: 48, height: 48 }} />
                  <div style={{ marginTop: 12, color: '#1e9ddc', fontWeight: 500 }}>Đang tải dữ liệu...</div>
                </td>
              </tr>
            ) : (
              paginatedBooks.map((book, index) => (
                <tr key={book.book_id}>
                  <td className="text-center">{(currentPage - 1) * booksPerPage + index + 1}</td>
                  <td className="text-center">{book.book_id}</td>
                  <td className="text-center">
                    <span
                      style={{ color: '#1e9ddc', cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => { setDetailBook(book); setDetailModal(true); }}
                    >
                      {book.title}
                    </span>
                  </td>
                  <td className="text-center">{book.author_name}</td>
                  <td className="text-center">{book.lang}</td>
                  <td className="text-center">{book.publisher_year}</td>
                  <td className="text-center">{book.location}</td>
                  <td className="text-center">{book.quantity}</td>
                  <td className="text-center">{book.genre}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                      <ActionButton
                        onClick={() => {
                          setCrudAction('update');
                          setSelectedBook(book);
                        }}
                        label="Sửa"
                        icon={faPenToSquare}
                        className="btn-custom-edit"
                      />
                      
                     <ActionButton
                        onClick={() => {
                          setCrudAction('delete');
                          setSelectedBook(book);
                        }}
                        label="Xoá"
                        icon={faTrash}
                        className="btn-custom-delete"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        {/* Thanh phân trang */}
        {totalPages > 1 && (
          <div className="pagination-wrapper d-flex justify-content-center align-items-center mt-3">
            <Button
              variant="outline-primary"
              size="sm"
              className="mx-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &lt;
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "primary" : "outline-primary"}
                size="sm"
                className="mx-1"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              className="mx-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              &gt;
            </Button>
          </div>
        )}
      </div>
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

      {/* Modal xem chi tiết sách */}
      <Modal show={detailModal} onHide={() => setDetailModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailBook && (
            <div style={{ display: 'flex', gap: 30 }}>
              <img
                src={detailBook.cover_url || defaultBookCover}
                alt="Ảnh bìa sách"
                style={{ width: 135, height: 190, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
              />
              <div style={{ flex: 1 }}>
                <div><b>Mã sách:</b> {detailBook.book_id}</div>
                <div><b>Tên sách:</b> {detailBook.title}</div>
                <div><b>Tác giả:</b> {detailBook.author_name}</div>
                <div><b>Ngôn ngữ:</b> {detailBook.lang}</div>
                <div><b>Năm xuất bản:</b> {detailBook.publisher_year}</div>
                <div><b>Vị trí:</b> {detailBook.location}</div>
                <div><b>Số lượng:</b> {detailBook.quantity}</div>
                <div><b>Thể loại:</b> {detailBook.genre}</div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default BookManagement;
