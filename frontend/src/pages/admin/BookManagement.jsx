  import { useState, useEffect, useCallback} from 'react';
  import { Container, Button, Table, Modal, Spinner } from 'react-bootstrap';
  import AlertBox from '../../components/alert-box/AlertBox';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faSort, faSortUp, faSortDown, faPenToSquare, faTrash, faPlus, faFilter, faUser, faCalendar, faGlobe } from '@fortawesome/free-solid-svg-icons';
  import {
    listBook,
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

  // Custom hook debounce
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  }

  function BookManagement() {
    const token = localStorage.getItem("token"); // token 
    const [books, setBooks] = useState([]); // Dữ liệu sách hiện tại
    const [totalBooks, setTotalBooks] = useState(0); // Tổng số sách phù hợp
    const [crudAction, setCrudAction] = useState(null); // Modal CRUD
    const [selectedBook, setSelectedBook] = useState(null); // Sách được chọn
    const [alertBox, setAlertBox] = useState(null); // Thông báo
    const [searchTerm, setSearchTerm] = useState(''); // Input tìm kiếm
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterAuthor, setFilterAuthor] = useState('All');
    const [filterYear, setFilterYear] = useState('All');
    const [filterLang, setFilterLang] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [detailBook, setDetailBook] = useState(null);
    const [filterOptions, setFilterOptions] = useState({ authors: [], years: [], langs: [], categories: [] });
    const booksPerPage = 8; // Số sách hiển thị trên mỗi trang
    
    // Debounce cho searchTerm
    const debouncedSearchTerm = useDebounce(searchTerm, 700);

    // Hàm fetch sách từ server (API hỗ trợ phân trang, filter, search, sort)
        const fetchBooks = useCallback(async (params = {}) => {
          setLoading(true);
          try {
              const finalParams = {
        page: params.page ?? currentPage,
        limit: params.limit ?? booksPerPage,
        search: params.search ?? debouncedSearchTerm,
        category: params.category ?? filterCategory,
        author: params.author ?? filterAuthor,
        year: params.year ?? filterYear,
        lang: params.lang ?? filterLang,
        sortKey: params.sortKey ?? sortConfig.key,
        sortOrder: params.sortOrder ?? sortConfig.direction
      };
            const res = await listBook( finalParams, token);
            if (res.success) {
              setBooks(res.data.books);
              setTotalBooks(res.data.total);
              setFilterOptions(res.data.filterOptions)
            } else {
              setBooks([]); 
              setTotalBooks(0);
           
              setAlertBox({ message: res.message, type: 'error' });
            }
          } catch (err) {
            setBooks([]);
            setTotalBooks(0);
            console.error('Error fetching books:', err);
            setAlertBox({ message: 'Lỗi lấy danh sách sách', type: 'error' });
          } finally {   
            setLoading(false);
          }
        }, [currentPage, booksPerPage, debouncedSearchTerm, filterCategory, filterAuthor, filterYear, filterLang, sortConfig,token]);

  // Gọi fetchBooks mỗi khi currentPage hoặc các tiêu chí khác thay đổi
  useEffect(() => {
        fetchBooks();
      }, [fetchBooks]);

    // Reset trang về 1 khi filter hoặc search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterCategory, filterAuthor, filterYear, filterLang]);


const handleChangePage = (newPage) => {
  setCurrentPage(newPage);
};

    // Xử lý sắp xếp
    const handleSort = (key) => {
      setSortConfig((prev) => {
        if (prev.key === key) {
          if (prev.direction === 'asc') return { key, direction: 'desc' };
          if (prev.direction === 'desc') return { key: '', direction: 'desc' }; // Mặc định
        }
        return { key, direction: 'asc' };
      });
    };

    // Hiển thị icon sắp xếp
    const renderSortIcon = (key) => {
      if (sortConfig.key !== key) return (
        <FontAwesomeIcon icon={faSort} className="sort-icon inactive" />
    );
      if (sortConfig.direction === 'asc')return (
        <FontAwesomeIcon icon={faSortUp} className="sort-icon asc" />
    );
      if (sortConfig.direction === 'desc') return (
        <FontAwesomeIcon icon={faSortDown} className="sort-icon desc" />
    );
      return null;
    };

    // Thanh chuyển trang
    const totalPages = Math.ceil(totalBooks / booksPerPage);
 const getPages = () => {
  let pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Luôn có trang 1
    pages.push(1);

    if (currentPage <= 4) {
      // Gần đầu
      pages.push(2, 3, 4, 5);
      pages.push("...");
      pages.push(totalPages);
    }  else if (currentPage > 4 && currentPage + 5 < totalPages) {
      // Ở giữa
      pages.push("...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }else if(currentPage + 5 >= totalPages){
      pages.push("...")
      for (let i = totalPages - 5; i <= totalPages ; i++){
        pages.push(i)
      }
    }
  }
  return pages;
};

    // Xử lý thêm sách
    const handleAdd = async (data) => {
      try {
        // Gọi API thêm sách
        const res = await addBook(data,token);
        if (res.success) {
          setAlertBox({ message: res.message, type: 'success' });
          setCurrentPage(1);
          fetchBooks({ page: 1 });
    
          return true;
        } else {
          setAlertBox({ message: res.message, type: 'error' });
          return false;
        }
      } catch (err) {
        setAlertBox({ message: 'Lỗi thêm sách', type: 'error' });
        return false;
      }
    };

    // Xử lý cập nhật sách
const handleUpdate = async (id,data) => {
  try {
    const res = await updateBook(id,data, token);
    if (res.success) {
      setAlertBox({ message: res.message, type: 'success' });
      console.log(res)
      // Cập nhật state books trực tiếp thay vì gọi lại API
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.book_id === data.book_id ? {...book, ...data} : book
          )
        );
      
      setSelectedBook(null);
      return true;
    } else {
      setAlertBox({ message: res.message, type: 'error' });
      return false;
    }
  } catch (err) {
    setAlertBox({ message: 'Lỗi cập nhật sách', type: 'error' });
    return false;
  }
};
    // Xử lý xoá sách
      const handleDelete = async (data) => {
        try {
          const res = await deleteBook(data,token);
          if (res.success) {
            setAlertBox({ message: res.message, type: 'success' });
            fetchBooks({ page: currentPage });
            setSelectedBook(null);
          } else {
            setAlertBox({ message: res.message, type: 'error' });
          }
        } catch (err) {
          setAlertBox({ message: 'Lỗi xoá sách', type: 'error' });
        }
      };

    // Lấy giá trị filter từ API nếu có, nếu không thì lấy từ dữ liệu hiện tại
    const uniqueAuthors = filterOptions.authors.length > 0 ? filterOptions.authors : ['All'];
    const uniqueYears = filterOptions.years.length > 0 ? filterOptions.years : ['All'];
    const uniqueLangs = filterOptions.langs.length > 0 ? filterOptions.langs : ['All'];
    const uniqueCategories = filterOptions.categories.length > 0 ? filterOptions.categories : ['All'];

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
        <div className="search-bar-container ">
          <div className="filter-row">
            {/* Bộ lọc thể loại sách */}
            <Filter
              icon={faFilter}
              filterTitle="Category"
              filterName={filterCategory}
              setFilter={setFilterCategory}
              uniqueKeyword={uniqueCategories}
            />
            {/* Bộ lọc tác giả */}
            <Filter
              icon={faUser}
              filterTitle="Author"
              filterName={filterAuthor}
              setFilter={setFilterAuthor}
              uniqueKeyword={uniqueAuthors}
            />
            {/* Bộ lọc năm xuất bản */}
            <Filter
              icon={faCalendar}
              filterTitle="Year of publication"
              filterName={filterYear} 
              setFilter={setFilterYear}
              uniqueKeyword={uniqueYears}
            />
            {/* Bộ lọc ngôn ngữ */}
            <Filter
              icon={faGlobe}
              filterTitle="Language"
              filterName={filterLang}
              setFilter={setFilterLang}
              uniqueKeyword={uniqueLangs}
            />
          </div>
          <div className="search-row" >
            <div style={{ marginRight: '20px' }}>
              <Search
                style = {{ minWidth : "425px"}}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                placeholder="Search by book title, author name or book genre"
              />
            </div>
         <div className = "mr-3">
            <ActionButton 
              onClick={() => {
                setCrudAction('add');
                setSelectedBook(null);
              }}
              label="Add book"
              icon={faPlus}
              className="btn-custom-add-book "

            />
          </div>
            {/* <div className="ml-3">
              <span style={{ fontWeight: 500, color: '#1e9ddc' }}>
                Hiển thị {books.length > 0 ? (currentPage - 1) * booksPerPage + 1 : 0}
                -{(currentPage - 1) * booksPerPage + books.length} trên tổng {totalBooks} sách
              </span>
            </div>
            <div className="ml-3">
              <select
                value={booksPerPage}
                onChange={e => setBooksPerPage(Number(e.target.value))}
                style={{ borderRadius: 6, padding: '2px 8px', marginLeft: 8 }}
              >
                {[10, 20, 50].map(num => (
                  <option key={num} value={num}>{num}/trang</option>
                ))}
              </select>
            </div> */}
          </div>
        </div>
        <div className="table-scroll-wrapper">
          {/* Bảng hiển thị sách */}
          <Table striped bordered hover responsive className="custom-table">
           <thead>
  <tr>
    <th className="text-center" style={{ width: '7%' }}>No.</th>
    <th className="text-center" style={{ width: '11%' }}>Book code</th>
    <th className="text-center" style={{ width: '11%', cursor: 'pointer' }}>
      Title
    </th>
    <th className="text-center" style={{ width: '15%', cursor: 'pointer'}}>
      Author
    </th>
   <th className="text-center" style={{ width: '15%' }}>
  <div>Location</div>
  <small style={{ display: 'block', fontSize: '0.9em', color: '#555' }}>
    ( floor-room-shelf )
  </small>
</th>

    <th className="text-center" style={{ width: '10%', cursor: 'pointer' }} onClick={() => handleSort('quantity')}>
      Quantity {renderSortIcon('quantity')}
    </th>
    <th className="text-center" style={{ width: '15%' }}>Category</th>
    <th className="text-center" style={{ width: '18%' }}>Action</th>
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
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>
                    No matching books were found.
                  </td>
                </tr>
              ) : (
                books.map((book, index) => (
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
                          label="Update"
                          icon={faPenToSquare}
                          className="btn-custom-update-book"
                        />
                        <ActionButton
                          onClick={() => {
                            setCrudAction('delete');
                            setSelectedBook(book);
                          }}
                          label="Delete"
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
          {/* Thanh phân trang hiện đại */}
          {totalPages > 1 && (
            <div className="pagination-wrapper d-flex justify-content-center align-items-center">
              <Button
                variant="outline-primary"
                size="sm"
                className="mx-1"
                disabled={currentPage === 1}
                onClick={() => {
                  handleChangePage(currentPage - 1)
                }}
              >
                &lt;
              </Button>
                {getPages().map((p, i) =>
                 p === '...' ? (
                   <span key={`dots-${i}`} style={{ margin: '0 6px', color: '#888', fontWeight: 600 }}>...</span>
                ) : (
                   <Button
                     key={`page-${p}-${i}`}   
                     variant={currentPage === p ? 'primary' : 'outline-primary'}
                     size="sm"
                     className="mx-1"
                     onClick={() => handleChangePage(p)}
                  >
                     {p}
                   </Button>
                    )
                 )}

              <Button
                variant="outline-primary"
                size="sm"
                className="mx-1 btn-pagination"
                disabled={currentPage === totalPages}
                onClick={() => {
                  handleChangePage (currentPage + 1)
                }}
              >
                &gt;
              </Button>
            </div>
          )}
        </div>
        {/* Modal thêm sách */}
        {crudAction === 'add' && (
          <AddBookModal
            show={true}
            hide={() => setCrudAction('')}
            addBook={handleAdd}
   
          />
        )}
        {/* Modal cập nhật sách */}
          {crudAction === 'update' && (
            <UpdateBookModal
              show={true}
              hide={() => setCrudAction('')}
              handleUpdate={handleUpdate}
              bookData={selectedBook}
      
            />
          )}
        {/* Modal xóa sách */}
        {crudAction === 'delete' && (
          <DeleteBookModal
            show={true}
            hide={() => {
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
          <Modal.Title>Book details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailBook && (
            <div style={{ display: 'flex', gap: 30 }}>
              <img
                src={detailBook.cover_url || defaultBookCover}
                alt=""
                style={{ width: 135, height: 190, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
              />
              <div style={{ flex: 1 }}>
                <div><b>Book code:</b> {detailBook.book_id}</div>
                <div><b>Title:</b> {detailBook.title}</div>
                <div><b>Author:</b> {detailBook.author_name}</div>
                <div><b>Language:</b> {detailBook.lang}</div>
                <div><b>Year of publication:</b> {detailBook.publisher_year}</div>
                <div><b>Location:</b> {detailBook.location}</div>
                <div><b>Quantity:</b> {detailBook.quantity}</div>
                <div><b>Category:</b> {detailBook.genre}</div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default BookManagement;

