export interface Product {
  id: number;
  barcode: string;
  name: string;
  brandName: string;
  brandId?: number;
  categoryId?: number;
  categoryName: string;
  purchasePrice: number;
  salePrice: number;
  currentStock?: number;
  initialStock?: number;
  minimumStock: number;
  active: boolean;
}
