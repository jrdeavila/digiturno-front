import { useMemo, useState } from "react";

export default function usePagination<T>(
  items: T[],
  perPage: number = 10
): {
  items: T[];
  page: number;
  pages: number;
  setPage: (page: number) => void;
} {
  const [page, setPage] = useState<number>(1);
  const pages = Math.ceil(items.length / perPage);
  const itemsPerPage = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return items.slice(start, end);
  }, [items, page, pages]);
  return {
    items: itemsPerPage,
    page,
    pages,
    setPage,
  };
}
