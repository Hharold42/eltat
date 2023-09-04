import React from "react";

function PaginationButton({ curPage, setCurrentPage, totalPages }) {
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const pageRange = 2; // Number of pages to show before and after the current page

    // First Page
    pageNumbers.push(
      <button
        key={1}
        className={`px-2 py-1 text-white text-sm ${
          curPage === 1 ? "bg-indigo-500" : "bg-indigo-300 hover:bg-indigo-600"
        } rounded-sm focus:outline-none focus:ring focus:ring-indigo-200 mx-1`}
        onClick={() => handlePageClick(1)}
      >
        1
      </button>
    );

    // Ellipsis before currentPage - 1
    if (curPage - pageRange > 2) {
      pageNumbers.push(
        <span key="before-ellipsis" className="text-sm mx-1">
          ...
        </span>
      );
    }

    // Pages from currentPage - 1 to currentPage + 1
    for (
      let i = Math.max(2, curPage - pageRange);
      i <= Math.min(totalPages - 1, curPage + pageRange);
      i++
    ) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-2 py-1 text-white text-sm ${
            curPage === i
              ? "bg-indigo-500"
              : "bg-indigo-300 hover:bg-indigo-600"
          } rounded-sm focus:outline-none focus:ring focus:ring-indigo-200 mx-1`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }

    // Ellipsis after currentPage + 1
    if (curPage + pageRange < totalPages - 1) {
      pageNumbers.push(
        <span key="after-ellipsis" className="text-sm mx-1">
          ...
        </span>
      );
    }

    // Last Page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          className={`px-2 py-1 text-white text-sm ${
            curPage === totalPages
              ? "bg-indigo-500"
              : "bg-indigo-300 hover:bg-indigo-600"
          } rounded-sm focus:outline-none focus:ring focus:ring-indigo-200 mx-1`}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return <div className="flex justify-center my-2">{renderPageNumbers()}</div>;
}

export default PaginationButton;
