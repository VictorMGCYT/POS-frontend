


export interface productsPagination {
  totalProducts:   number;
  currentPage:     number;
  totalPages:      number;
  productsPerPage: number;
  products:        productsListInteface[];
}

export interface productsListInteface {
  id:            string;
  name:          string;
  skuCode:       string;
  isByWeight:    boolean;
  unitPrice:     string;
  purchasePrice: string;
  stockQuantity: string;
  createdAt:     Date;
  deletedAt:     Date | null;
}
