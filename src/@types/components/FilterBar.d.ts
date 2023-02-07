export interface FilterBarType {
  activeCompany?: string;
  activeSortDirection: string;
  activeSortOrderType: string;
  applyFilter(...args: unknown[]): unknown;
  className?: string;
  dealsFilter?: boolean;
  filterDeals?: object;
  filterModalData?: string;
  lang: string;
}
