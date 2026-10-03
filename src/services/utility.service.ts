import { apiClient } from "@/lib/api-client";
import { UTILITY_ENDPOINTS } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { BankItem, CurrencyItem, GoldPriceItem, PetrolItem } from "@/types/utility.types";

export const UtilityService = {
    /**
     * Tỉ giá ngoại tệ Vietcombank từ J2Team API
     */
    getCurrencyRates: async (): Promise<ApiResponse<CurrencyItem[]>> => {
        return apiClient.get<CurrencyItem[]>(UTILITY_ENDPOINTS.CURRENCY);
    },

    /**
     * Giá vàng SJC từ J2Team API
     */
    getGoldPrices: async (): Promise<ApiResponse<GoldPriceItem[]>> => {
        return apiClient.get<GoldPriceItem[]>(UTILITY_ENDPOINTS.GOLD);
    },

    /**
     * Giá xăng dầu Petrolimex từ J2Team API
     */
    getPetrolPrices: async (): Promise<ApiResponse<PetrolItem[]>> => {
        return apiClient.get<PetrolItem[]>(UTILITY_ENDPOINTS.PETROL);
    },

    /**
     * Danh sách ngân hàng Việt Nam (NAPAS / VietQR) từ J2Team API
     */
    getBanks: async (): Promise<ApiResponse<BankItem[]>> => {
        return apiClient.get<BankItem[]>(UTILITY_ENDPOINTS.BANKS);
    },
};

export type { CurrencyItem, GoldPriceItem, PetrolItem, BankItem };
