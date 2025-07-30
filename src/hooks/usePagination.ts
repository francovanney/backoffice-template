import { useMemo } from "react";

interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}

export const usePagination = ({
  currentPage,
  totalPages,
  maxVisiblePages = 5,
}: UsePaginationProps) => {
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const showPagination = totalPages > 1;

  return {
    pageNumbers,
    hasPrevious,
    hasNext,
    showPagination,
  };
};
