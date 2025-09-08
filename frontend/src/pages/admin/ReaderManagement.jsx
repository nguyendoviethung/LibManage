import { useState, useEffect, useCallback } from 'react';
import { Container, Button, Table, Modal, Spinner } from 'react-bootstrap';
import AlertBox from '../../components/alert-box/AlertBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faPlus, faUser, faBuilding, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import {
listReader,
updateReader,
addReader,
updateAccountReader,
} from '../../api/ReaderManagementAPI';

import UpdateAccountModal from '../../components/reader-modal/UpdateAccountModal';
import ReaderForm from '../../components/reader-modal/ReaderForm.jsx';
import './ReaderManagement.scss';
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

export default function ReaderManagement() {
  const token = localStorage.getItem("token"); 
  const [readers, setReaders] = useState([]); 
  const [totalReaders, setTotalReaders] = useState(0); 
  const [crudAction, setCrudAction] = useState(null); 
  const [selectedReader, setSelectedReader] = useState(null); 
  const [alertBox, setAlertBox] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filterFaculty, setFilterFaculty] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [detailReader, setDetailReader] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ faculties: [], statuses: [] });
  const readersPerPage = 8; 
    
  // Debounce 
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const fetchReaders = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const finalParams = {
        page: params.page ?? currentPage,
        limit: params.limit ?? readersPerPage,
        search: params.search ?? debouncedSearchTerm,
        faculty: params.faculty ?? filterFaculty,
        status: params.status ?? filterStatus,
        sortKey: params.sortKey ?? sortConfig.key,
        sortOrder: params.sortOrder ?? sortConfig.direction
      };
      const res = await listReader(finalParams, token);
      if (res.success) {
        setReaders(res.data);
        setTotalReaders(res.data.length > 0 ? res.data[0].total_count : 0);

        setFilterOptions(res.filterOptions);
      } else {
        setReaders([]);
        setTotalReaders(0);
        setAlertBox({ message: res.message, type: 'error' });
      }
    } catch (err) {
      console.error('Error fetching readers:', err);
      setAlertBox({ message: 'Lỗi lấy danh sách người dùng', type: 'error' });
      setReaders([]);
      setTotalReaders(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, readersPerPage, debouncedSearchTerm, filterFaculty, filterStatus, sortConfig, token]);

  useEffect(() => { fetchReaders(); }, [fetchReaders]);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearchTerm, filterFaculty, filterStatus]);

  const handleChangePage = (newPage) => { setCurrentPage(newPage); };

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: '', direction: 'desc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="sort-icon inactive" />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="sort-icon asc" />;
    if (sortConfig.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} className="sort-icon desc" />;
    return null;
  };

  const totalPages = Math.ceil(totalReaders / readersPerPage);
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
  const handleAddReader = async (data) => {
    try {
      const res = await addReader(data, token);
      if (res.success) {
        setAlertBox({ message: res.message, type: 'success' });
        setCurrentPage(1);
        fetchReaders({ page: 1 });
        return true;
      } else {
        setAlertBox({ message: res.message, type: 'error' });
        return false;
      }
    } catch {
      setAlertBox({ message: 'Error adding user', type: 'error' });
      return false;
    }
  };

  const handleUpdateInfoReader = async (id, data) => {
    try {
      const res = await updateReader(id, data, token);
      if (res.success) {
        setAlertBox({ message: res.message, type: 'success' });
   
        setReaders(prev => prev.map(r => r.student_id === data.student_id ? {...r, ...data} : r));
        setSelectedReader(null);
        return true;
      } else {
        setAlertBox({ message: res.message, type: 'error' });
        return false;
      }
    } catch {
      setAlertBox({ message: 'User update error', type: 'error' });
      return false;
    }
  };

 const handleUpdateAccount = async(id,data) => {
  try {
    const res = await updateAccountReader(id,data,token);
     if (res.success) {
        setAlertBox({ message: res.message, type: 'success' });
        setReaders(prev => prev.map(r => r.student_id === data.student_id ? {...r, ...data} : r));
        setSelectedReader(null);
        return true;
      } else {
        setAlertBox({ message: res.message, type: 'error' });
        return false;
      }
    } catch {
      setAlertBox({ message: 'User update error', type: 'error' });
      return false;
    }
  };
 
  const uniqueFaculties = (filterOptions.faculties && filterOptions.faculties.length > 0) 
    ? filterOptions.faculties 
    : ['All'];

  const uniqueStatuses = (filterOptions.statuses && filterOptions.statuses.length > 0) 
    ? filterOptions.statuses 
    : ['All'];

  
  return (
    <Container className="mt-4">
      <div className="reader-management">
        {alertBox && (
          <AlertBox
            message={alertBox.message}
            type={alertBox.type}
            onClose={() => setAlertBox(null)}
          />
        )}
        <div className="search-bar-container">
          <div className="filter-row">
            <Filter
              icon={faBuilding}
              filterTitle="Faculty"
              filterName={filterFaculty}
              setFilter={setFilterFaculty}
              uniqueKeyword={uniqueFaculties}
            />
            <Filter
              icon={faUser}
              filterTitle="Reader Status"
              filterName={filterStatus}
              setFilter={setFilterStatus}
              uniqueKeyword={uniqueStatuses}
            />
        
       
            <div style={{ marginRight: '20px' }}>
              <Search
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                placeholder="Search for readers by name or student ID"
              />
            </div>
            <ActionButton
              onClick={() => { setCrudAction('add-reader'); setSelectedReader(null); }}
              label="Add reader"
              icon={faPlus}
              className="btn-custom-add-reader"
            />
          </div> 
        </div>

        {/* Table */}
        <div className="table-scroll-wrapper">
          <Table striped bordered hover responsive className="custom-table">
            <thead>
              <tr>
                <th className="text-center" style = {{width : '7%'}}>No.</th>
                <th className="text-center" onClick={() => handleSort('student_id')} style={{cursor:'pointer', width: '10%' }}>Student ID {renderSortIcon('student_id')}</th>
                <th className="text-center" style={{cursor:'pointer',width: '15%'}}>Full Name </th>

                <th className="text-center"style = {{width: '20%'}}>Faculty</th>
                <th className="text-center"style = {{width: '10%'}}>Status</th>
                <th className="text-center"style = {{width: '28%'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{textAlign:'center', padding:'48px 0'}}>
                    <Spinner animation="border" variant="primary" style={{ width: 48, height: 48 }} />
                    <div style={{ marginTop: 12, color:'#1e9ddc', fontWeight:500 }}>Loading data...</div>
                  </td>
                </tr>
              ) : readers.length === 0 ? (
                <tr><td colSpan={8} style={{textAlign:'center', padding:'48px 0', color:'#888'}}>No matching readers found.</td></tr>
              ) : (
                readers.map((r, index) => (
                  <tr key={r.student_id}>
                    <td className="text-center">{(currentPage - 1) * readersPerPage + index + 1}</td>
                    <td className="text-center">{r.student_id}</td>
                    <td className="text-center">
                      <span style={{ color:'#1e9ddc', cursor:'pointer', textDecoration:'underline' }}
                        onClick={() => { setDetailReader(r); setDetailModal(true); }}>
                        {r.full_name}
                      </span>
                    </td>
                 
                    <td className="text-center">{r.faculty}</td>
                    <td className="text-center">{r.status}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <ActionButton
                          onClick={() => { setCrudAction('update-info-reader');
                                           setSelectedReader(r);
                                         }}
                          label="Update personal information"
                          icon={faUser} 
                          className="btn-custom-update-reader-info"
                        />
                        <ActionButton
                          onClick={() => { setCrudAction('update-account'); 
                                           setSelectedReader(r); 
                                         }}
                          label="Update account information"
                          icon={faAddressCard}
                          className="btn-custom-update-account-information"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination */}
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
        {crudAction === 'update-account' && <UpdateAccountModal show={true} onHide={()=>setCrudAction('')} handleUpdateAccount={handleUpdateAccount} readerData={selectedReader} token = {token} />}
        {crudAction === 'update-info-reader' && <ReaderForm show={true} onHide={()=>setCrudAction('')} handleUpdate={handleUpdateInfoReader} readerData={selectedReader} actionState = {'update-info-reader'}/>}
        {crudAction === 'add-reader' && <ReaderForm show={true} onHide={()=>setCrudAction('')} handleAddReader={handleAddReader} readerData={selectedReader} actionState = {'add'}/>}
      </div>

      {/* Detail Modal */}
<Modal show={detailModal} onHide={() => setDetailModal(false)} dialogClassName="custom-modal"  centered>
  <Modal.Header closeButton>
    <Modal.Title>Reader details</Modal.Title>
  </Modal.Header>
  <Modal.Body dialogClassName="modal-body modal-content">
    {detailReader && (
      <div style={{ display: 'flex', gap: 30 }}>
        <img
          src={detailReader.avatar_url} 
          alt="" 
          style={{
            width: 135,
            height: 190,
            objectFit: 'cover',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
          }}
        />
        {/* Thông tin chi tiết */}
        <div style={{ flex: 1, lineHeight: '1.8' }}>
          <div><b>Student:</b> {detailReader.student_id}</div>
          <div><b>Full Name:</b> {detailReader.full_name}</div>
          <div><b>Email:</b> {detailReader.email}</div>
          <div><b>Phone Number:</b> {detailReader.phone_number}</div>
          <div><b>Faculty:</b> {detailReader.faculty}</div>
          <div><b>Status:</b> {detailReader.status}</div>
        </div>
      </div>
    )}
    </Modal.Body>
  </Modal>
</Container>
  );
}


