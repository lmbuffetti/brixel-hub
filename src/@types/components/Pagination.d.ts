export interface PaginationType {
  activePage: any;
  className?: string;
  itemsPerPage: any;
  lang: string;
  paginate: (data: string, page: number, active: number) => void;
  totalItems: number;
}
