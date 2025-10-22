export interface PaginatedResult<TData> {
  items: TData[];
  total: number;
  page: number;
  pages: number;
}
