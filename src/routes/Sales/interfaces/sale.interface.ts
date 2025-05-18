
export interface SaleInterface {
    saleItems:     SaleItem[];
    userId:        string;
    paymentMethod: string;
}

export interface SaleItem {
    productId: string;
    quantity:  string;
}
