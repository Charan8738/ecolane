import React from "react";
import { Pagination, PaginationLink, PaginationItem } from "reactstrap";
import Icon from "../icon/Icon";

const PaginationComponent = ({ itemPerPage, totalItems, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemPerPage);

  // Function to handle pagination click for a specific page
  const handlePageClick = (page, event) => {
    event.preventDefault(); // Prevent page scroll to top
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      paginate(page);
    }
  };

  // Logic for calculating first and last visible buttons
  let firstVisible = Math.max(1, currentPage - 1);
  let lastVisible = Math.min(totalPages, firstVisible + 4);

  if (lastVisible - firstVisible < 4) {
    firstVisible = Math.max(1, lastVisible - 4);
  }

  return (
    <Pagination aria-label="Page navigation example">
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink
          className="page-link-prev"
          onClick={(ev) => handlePageClick(currentPage - 1, ev)}
          href="#prev"
        >
          <Icon name="chevrons-left" />
          <span>Prev</span>
        </PaginationLink>
      </PaginationItem>

      {firstVisible > 1 && (
        <React.Fragment>
          <PaginationItem>
            <PaginationLink onClick={(ev) => handlePageClick(1, ev)} href="#pageitem">
              1
            </PaginationLink>
          </PaginationItem>
          {firstVisible > 2 && <span className="pagination-dots">...</span>}
        </React.Fragment>
      )}

      {Array.from({ length: lastVisible - firstVisible + 1 }, (_, index) => firstVisible + index).map(
        (item) => (
          <PaginationItem className={currentPage === item ? "active" : ""} key={item}>
            <PaginationLink
              tag="a"
              href="#pageitem"
              onClick={(ev) => handlePageClick(item, ev)}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        )
      )}

      {lastVisible < totalPages && (
        <React.Fragment>
          {lastVisible < totalPages - 1 && <span className="pagination-dots">...</span>}
          <PaginationItem>
            <PaginationLink onClick={(ev) => handlePageClick(totalPages, ev)} href="#pageitem">
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </React.Fragment>
      )}

      <PaginationItem disabled={currentPage >= totalPages}>
        <PaginationLink
          className="page-link-next"
          onClick={(ev) => handlePageClick(currentPage + 1, ev)}
          href="#next"
        >
          <span>Next</span>
          <Icon name="chevrons-right" />
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationComponent;
