export interface ProductCreateDTO {
  barcode?: string;
  name?: string;
  brandId?: number;
  categoryId?: number;
  purchasePrice?: number;
  salePrice: number;
  initialStock?: number;
  currentStock?: number;
  minimumStock?: number;
  active?: boolean;
}