import { BaseEntity, BaseQueryParams } from './api';

export interface InvoiceItem extends BaseEntity {
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerTaxCode: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue';
    accountNumber: string;
    bankBin: string;
    bankName: string;
}

export interface CreateInvoiceDto {
    customerName: string;
    customerTaxCode: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    bankBin: string;
    bankName: string;
    accountNumber: string;
}

export interface InvoiceListParams extends Partial<BaseQueryParams> {
    status?: 'all' | 'paid' | 'pending' | 'overdue';
}

export interface DepartmentBudget {
    id: string;
    department: string;
    allocated: number;
    spent: number;
    manager: string;
}
