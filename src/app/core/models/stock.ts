export interface StockRequest {
    productId: number;
    quantity:  number;
    userId:    number;
}

export interface StockResponse {
    id:         number;
    productId:  number;
    quantity:   number;
    userId:     number;
    timestamp:  string;
}