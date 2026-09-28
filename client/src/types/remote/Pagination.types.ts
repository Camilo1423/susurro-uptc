export type PagedValue<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type PagedResponse<T> = {
  statusCode: number;
  message: string;
  data: PagedValue<T>;
};
