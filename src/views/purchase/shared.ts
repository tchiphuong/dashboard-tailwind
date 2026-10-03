// Re-export shared data from inventory for purchase pages
export type { PurchaseOrder, Supplier, GoodsReceipt } from '../inventory/shared';

export {
    mockPOs,
    mockSuppliers,
    mockReceipts,
    mockWarehouses,
    createFetchFn,
    formatCurrency,
} from '../inventory/shared';
