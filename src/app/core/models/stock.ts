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

export interface StockHistory {
    id:              number;
    productId:       number;
    productName:     string;
    movementType:    string;
    reason:          string;
    quantity:        number;
    date:            Date;
    userId:          number;
    stockResultante: number;
}

export interface StockRequestFilters {
    productName?: string;
    movementType?: 'INPUT' | 'OUTPUT';
    reason?: 'PURCHASE' | 'ADJUSTMENT' | 'SALE';
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
    sort?: string;
} 