import { Button } from 'react-bootstrap';

export default function Pagination({ currentPage, totalItems, pageSize, onChangePage }) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage <= 4) {
        pages.push(2, 3, 4, 5);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage > 4 && currentPage + 5 < totalPages) {
        pages.push('...');
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage + 5 >= totalPages) {
        pages.push('...');
        for (let i = totalPages - 5; i <= totalPages; i++) pages.push(i);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper d-flex justify-content-center align-items-center">
      <Button
        variant="outline-primary"
        size="sm"
        className="mx-1"
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
      >
        &lt;
      </Button>

      {getPages().map((p, i) =>
        p === '...'
          ? (
            <span key={`dots-${i}`} style={{ margin: '0 6px', color: '#888', fontWeight: 600 }}>...</span>
          ) : (
            <Button
              key={`page-${p}-${i}`}
              variant={currentPage === p ? 'primary' : 'outline-primary'}
              size="sm"
              className="mx-1"
              onClick={() => onChangePage(p)}
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
        onClick={() => onChangePage(currentPage + 1)}
      >
        &gt;
      </Button>
    </div>
  );
}



