// src/common/pagination/index.ts
export function buildPaginationMeta(
  total: number,
  page: number,
  pageSize: number,
) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    totalItems: total,
    totalPages,
    currentPage: page,
    pageSize,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
