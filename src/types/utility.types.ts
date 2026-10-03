/**
 * J2Team Open APIs Data Contracts
 * https://apis.j2team.org/
 */

export interface CurrencyItem {
    currencyCode: string;
    currencyName: string;
    buy: number | string;
    transfer: number | string;
    sell: number | string;
}

export interface GoldPriceItem {
    type: string;
    buy: number | string;
    sell: number | string;
    company?: string;
}

export interface PetrolItem {
    type: string;
    price: number | string;
    change?: string;
}

export interface BankItem {
    id: number | string;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo?: string;
}
