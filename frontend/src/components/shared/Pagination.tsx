import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goTo = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" onClick={() => goTo(currentPage - 1)} disabled={!canPrev}>
        Previous
      </button>
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
      <button type="button" onClick={() => goTo(currentPage + 1)} disabled={!canNext}>
        Next
      </button>
    </nav>
  );
};
