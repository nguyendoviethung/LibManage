import { useState, useEffect, useCallback } from "react";
import { Container, Button, Table, Spinner, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  faFilter,
  faArrowLeft,
  faHandHolding,
  faSort,
  faSortUp,
  faSortDown,
  faCalendar,

} from "@fortawesome/free-solid-svg-icons";
import Search from "../../components/search-bar/Search.jsx";
import Filter from "../../components/filter/Filter.jsx";
import ActionButton from "../../components/action-button/ActionButton.jsx";
import BorrowBooks from "../../components/qrcode/Borrow";
import ReturnBooks from "../../components/qrcode/Return.jsx";
import "./BookLendingAndReturningManagement.scss";
import {borrowBooks,returnBooks,listBorrowReturn} from '../../api/LendingService.jsx';
import AlertBox from "../../components/alert-box/AlertBox.jsx";

// Custom hook debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BookLendingAndReturningManagement() {
  const token = localStorage.getItem("token");
  const [records, setRecords] = useState([]); 
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [QR, setQR] = useState(null);
  const [date,setDate] = useState({ start : null, 
                                    end : null
                                 })
  const recordsPerPage = 8;
  const [notification,setNotification] = useState(null); 
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Hàm fetch dữ liệu mượn trả
  const fetchRecords = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
      const d1 = date.start ? new Date(date.start) : null;
      const d2 = date.end ? new Date(date.end) : null;
      if (d1 && d2 && d2 < d1) {
      setNotification({type : "error", message : "End date must be greater than start date" })
      setRecords([]);
      setLoading(false  );
      return;
    }
    const finalParams = {
          start_date: params.date?.start ?? date.start,
          end_date: params.date?.end ?? date.end,
          page: params.page ?? currentPage,
          limit: params.limit ?? recordsPerPage,
          search: params.search ?? debouncedSearchTerm,
          status: params.status ?? filterStatus,
          sortKey: params.sortKey ?? sortConfig.key,
          sortOrder: params.sortOrder ?? sortConfig.direction,
        };
        const res = await listBorrowReturn(finalParams, token)

        if (res.success) {
          setRecords(res.data.records);
          setTotalRecords(res.data.total);
        } else {
          setRecords([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error fetching borrow records:", err);
        setRecords([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, recordsPerPage, debouncedSearchTerm, filterStatus, sortConfig, token,date]
  );

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterStatus]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "desc") return { key, direction: "asc" };
        if (prev.direction === "asc") return { key: "", direction: "desc" };
      }
      return { key, direction: "desc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FontAwesomeIcon icon={faSort} className="sort-icon inactive" />;
    if (sortConfig.direction === "asc")
      return <FontAwesomeIcon icon={faSortUp} className="sort-icon desc" />;
    if (sortConfig.direction === "desc")
      return <FontAwesomeIcon icon={faSortDown} className="sort-icon asc" />;
    return null;
  };

  const handleBorrowBooks = async (data) => {
  try {
    const res = await borrowBooks(data, token);
    if (res.success) {
      setNotification({
        message: res.message || "Borrowed book successfully!",
        type: "success"
      });
    } else {
      setNotification({
        message: res.message || "Failed to borrow book!",
        type: "error"
      });
    }
  } catch (error) {
    console.error("Lỗi gọi API borrowBooks:", error);
    setNotification({
      message: "Unable to connect to server. Please try again!",
      type: "error"
    });
  }
};

  const handleReturnBooks = async ({ readerID, bookIDs }) => {
  try {
    const data = { readerID, bookIDs };
    const res = await returnBooks( data, token);

    if (res.success) {
      setNotification({
        message: res.message || "Book returned successfully!",
        type: "success",
      });
    } else {
      setNotification({
        message: res.message || "Cannot return book!",
        type: "error",
      });
    }
  } catch (err) {
    console.error("Return book error:", err);
    setNotification({
      message: "Server connection error!",
      type: "error",
    });
  }
};

  const onClose = () => setQR(null);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

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


  const handleChangePage = (newPage) => {
         setCurrentPage(newPage);
        };

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // đưa về 00:00:00
    return d;
  };

  const StatusCell = ({ rec }) => { 
    if (rec.return_date) {
     return <span style={{ color: "green" }}>🟢 Returned</span>;
    }

    const today = normalizeDate(new Date());
    const dueDate = normalizeDate(rec.due_date);

    if (today > dueDate) {
      return <span style={{ color: "#e00000ff" }}>🔴 Overdue</span>;
    } else {
      return <span style={{ color: "#e9bd0dff" }}>🟡 Borrowed</span>;
    }
  };


  return (
    <>
      <Container className="mt-4">
        <div className="borrow-management">
          {/* Thanh công cụ */}
          <div className="option d-flex gap-3 flex-wrap mb-3">
            <Filter
              icon={faFilter}
              filterTitle="Filter by status"
              filterName={filterStatus}
              setFilter={setFilterStatus}
              uniqueKeyword={["All", "Borrowed", "Returned", "Overdue"]}
            />

            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search borrow records..."
            />

            <ActionButton
              label="Borrow books"
              icon={faHandHolding}
              className="btn-custom-borrow"
              onClick={() => setQR("Borrow")}
            />
            <ActionButton
              label="Return books"
              icon={faArrowLeft}
              className="btn-custom-return"
              onClick={() => setQR("Return")}
            />
<div style={{ display: "flex", gap: "20px" }}>
  {/* Start date */}
  <div style={{ position: "relative" }}>
    <DatePicker
      selected={date.start}
      onChange={(d) => setDate((prev) => ({ ...prev, start: d }))}
      dateFormat="dd/MM/yyyy"
      placeholderText="Start date: dd/mm/yyyy"
      className="datepicker-input"
    />
    <FontAwesomeIcon
      icon={faCalendar}
      className = "calendar"
    />
  </div>

  {/* End date */}
    <div style={{ position: "relative" }}>
      <DatePicker
        selected={date.end}
        onChange={(d) => setDate((prev) => ({ ...prev, end: d }))}
        dateFormat="dd/MM/yyyy"
        placeholderText="End date: dd/mm/yyyy"
        className="datepicker-input"
      />
      <FontAwesomeIcon
        icon={faCalendar}
        className = "calendar"
      />
    </div>
  </div>
</div>  

          {/* Bảng danh sách */}
          <div className="table-scroll-wrapper">
            <Table striped bordered hover responsive className="custom-table">
              <thead>
                <tr>
                   <th className="text-center">No.</th>
                  <th
                    className="text-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("studentId")}
                  >
                    Student ID 
                  </th>
                  <th className="text-center">Student Name</th>
                  <th className="text-center" >Title</th>
                  <th className="text-center"  
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("borrow_date")}
                    >Borrow Date {renderSortIcon("borrow_date")}
                    </th>
                  <th className="text-center">Due Date</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      <Spinner animation="border" />
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                      No borrow records found.
                    </td>
                  </tr>
                ) : (
                  records.map((rec, i) => (
                    <tr key={i}>
                      <td className="text-center">{i+1}</td>
                      <td className="text-center">{rec.student_id }</td>
                      <td className="text-center">{rec.full_name}</td>
                      <td className="text-center">{rec.title}</td>
                      <td className="text-center">
                        {rec.borrow_date ? new Date(rec.borrow_date + "T00:00:00").toLocaleDateString("vi-VN") : ""}
                      </td>
                      <td className="text-center">
                        {rec.due_date ? new Date(rec.due_date + "T00:00:00").toLocaleDateString("vi-VN") : ""}
                      </td>

                      <td className="text-center">
                         <StatusCell rec = {rec} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
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
        </div>
        
      </Container>

      {QR === "Borrow" && (
        <BorrowBooks onClose={onClose} handleBorrowBooks={handleBorrowBooks} token = {token} />
      )}
      {QR === "Return" && (
        <ReturnBooks onClose={onClose} handleReturnBooks={handleReturnBooks} token = {token} />
      )}
      {
        notification && (
          <AlertBox 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
        )
      }
    </>
  );
}
