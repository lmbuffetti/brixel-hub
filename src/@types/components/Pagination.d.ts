export interface PaginationType {
  activePage: any;
  className?: string;
  disableScrollTop?: boolean;
  itemsPerPage: any;
  lang: string;
  onChangePage?: () => void;
  paginate: (data: string, page: number, active: number) => void;
  totalItems: number;
}
