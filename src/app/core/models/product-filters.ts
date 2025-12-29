export interface ProductFilters {
  name?: string;
  brand?: string;
  category?: string;
  barcode?: string; // <-- agrega esto
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}