
// Archivo temporal de pruebas en memoria
export const productsList: productsListInteface[] = [
  {
    id: 'a1f56b34-9e3c-4cdd-9f3e-a1c654001234',
    name: 'Coca-Cola 600ml',
    skuCode: '7501055331311',
    isByWeight: false,
    unitPrice: '18.00',
    purchasePrice: '13.00',
    stockQuantity: '25.00'
  },
  {
    id: 'b7f23a88-2cd9-4af7-b78e-d5e2335abcd1',
    name: 'Bimbo Pan Blanco Grande',
    skuCode: '7501000110116',
    isByWeight: false,
    unitPrice: '39.00',
    purchasePrice: '31.00',
    stockQuantity: '3.00'
  },
  {
    id: 'c9d18b11-3a3d-49fe-938a-90203ab22d9c',
    name: 'Sabritas Clásicas 45g',
    skuCode: '7501011140151',
    isByWeight: false,
    unitPrice: '18.00',
    purchasePrice: '12.50',
    stockQuantity: '40.00'
  },
  {
    id: 'd221fc4f-612a-404b-8b26-947b3a994321',
    name: 'Huevo por kilo',
    skuCode: 'HUEVO-KG',
    isByWeight: true,
    unitPrice: '38.00',
    purchasePrice: '32.00',
    stockQuantity: '15.00'
  },
  {
    id: 'e5314c2d-7391-41d4-aebb-8c8e34ecbbd9',
    name: 'Azúcar estándar 1kg',
    skuCode: '7501020531102',
    isByWeight: false,
    unitPrice: '29.00',
    purchasePrice: '22.00',
    stockQuantity: '20.00'
  },
  {
    id: 'f8b3cde4-3c8c-44cf-9e26-5d6e1f2a1999',
    name: 'Frijol negro 1kg',
    skuCode: '7501125102116',
    isByWeight: false,
    unitPrice: '35.00',
    purchasePrice: '27.00',
    stockQuantity: '10.00'
  },
  {
    id: '1e3b859f-4c2c-4f9b-81e6-813f4a2d021a',
    name: 'Galletas Marias Gamesa 170g',
    skuCode: '7501011132309',
    isByWeight: false,
    unitPrice: '14.00',
    purchasePrice: '10.00',
    stockQuantity: '30.00'
  },
  {
    id: '2d7c091e-29f2-4e5f-a933-43234c8deabb',
    name: 'Jabón Zote Rosa 400g',
    skuCode: '7501026000118',
    isByWeight: false,
    unitPrice: '12.00',
    purchasePrice: '8.50',
    stockQuantity: '50.00'
  },
  {
    id: '7b8f023c-458f-4e5e-812c-3c9a3122bb44',
    name: 'Aceite Nutrioli 850ml',
    skuCode: '7501026005014',
    isByWeight: false,
    unitPrice: '47.00',
    purchasePrice: '38.00',
    stockQuantity: '18.00'
  },
  {
    id: '909cbdef-7dd8-4b5b-9b34-e1f4fdc3311e',
    name: 'Leche Lala Entera 1L',
    skuCode: '7501020522261',
    isByWeight: false,
    unitPrice: '24.00',
    purchasePrice: '19.00',
    stockQuantity: '22.00'
  }
];



export interface productsListInteface {
  id: string;
  name: string;
  skuCode: string;
  isByWeight: boolean;
  unitPrice: string; 
  purchasePrice: string; 
  stockQuantity: string; 
}
