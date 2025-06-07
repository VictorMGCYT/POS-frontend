export interface AddProductInterface {
    id?:            string;
    name:          string;
    skuCode:       string;
    isByWeight:    boolean;
    unitPrice:     string;
    purchasePrice: string;
    stockQuantity: string;
    createdAt?:     Date;
    deletedAt?:     Date | null;
}
