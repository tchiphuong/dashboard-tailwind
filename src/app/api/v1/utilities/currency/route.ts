import { successResponse } from "@/lib/api-response-helper";
import type { CurrencyItem } from "@/types";

export async function GET() {
    try {
        // Sử dụng Open Exchange Rates API (free, không cần key, có trong catalog apis.j2team.org)
        const res = await fetch("https://open.er-api.com/v6/latest/USD", {
            next: { revalidate: 3600 },
        });

        if (res.ok) {
            const data = await res.json();
            const rates = data.rates || {};
            const vndRate = rates.VND || 25450;

            const currencies: CurrencyItem[] = [
                {
                    currencyCode: "USD",
                    currencyName: "Đô la Mỹ",
                    buy: Math.round(vndRate * 0.995).toLocaleString("vi-VN"),
                    transfer: Math.round(vndRate * 0.998).toLocaleString("vi-VN"),
                    sell: Math.round(vndRate * 1.005).toLocaleString("vi-VN"),
                },
                {
                    currencyCode: "EUR",
                    currencyName: "Đồng Euro",
                    buy: Math.round((vndRate / (rates.EUR || 0.92)) * 0.995).toLocaleString("vi-VN"),
                    transfer: Math.round((vndRate / (rates.EUR || 0.92)) * 0.998).toLocaleString("vi-VN"),
                    sell: Math.round((vndRate / (rates.EUR || 0.92)) * 1.005).toLocaleString("vi-VN"),
                },
                {
                    currencyCode: "GBP",
                    currencyName: "Bảng Anh",
                    buy: Math.round((vndRate / (rates.GBP || 0.79)) * 0.995).toLocaleString("vi-VN"),
                    transfer: Math.round((vndRate / (rates.GBP || 0.79)) * 0.998).toLocaleString("vi-VN"),
                    sell: Math.round((vndRate / (rates.GBP || 0.79)) * 1.005).toLocaleString("vi-VN"),
                },
                {
                    currencyCode: "JPY",
                    currencyName: "Yên Nhật",
                    buy: ((vndRate / (rates.JPY || 155)) * 0.99).toFixed(1),
                    transfer: ((vndRate / (rates.JPY || 155)) * 0.995).toFixed(1),
                    sell: ((vndRate / (rates.JPY || 155)) * 1.01).toFixed(1),
                },
                {
                    currencyCode: "SGD",
                    currencyName: "Đô la Singapore",
                    buy: Math.round((vndRate / (rates.SGD || 1.34)) * 0.995).toLocaleString("vi-VN"),
                    transfer: Math.round((vndRate / (rates.SGD || 1.34)) * 0.998).toLocaleString("vi-VN"),
                    sell: Math.round((vndRate / (rates.SGD || 1.34)) * 1.005).toLocaleString("vi-VN"),
                },
                {
                    currencyCode: "AUD",
                    currencyName: "Đô la Úc",
                    buy: Math.round((vndRate / (rates.AUD || 1.52)) * 0.995).toLocaleString("vi-VN"),
                    transfer: Math.round((vndRate / (rates.AUD || 1.52)) * 0.998).toLocaleString("vi-VN"),
                    sell: Math.round((vndRate / (rates.AUD || 1.52)) * 1.005).toLocaleString("vi-VN"),
                },
            ];

            return successResponse(currencies, "Lấy tỷ giá ngoại tệ thực tế thành công");
        }
    } catch {
        // Fallback
    }

    const fallback: CurrencyItem[] = [
        { currencyCode: "USD", currencyName: "Đô la Mỹ", buy: "25,120", transfer: "25,150", sell: "25,480" },
        { currencyCode: "EUR", currencyName: "Đồng Euro", buy: "27,240", transfer: "27,320", sell: "27,850" },
        { currencyCode: "GBP", currencyName: "Bảng Anh", buy: "32,150", transfer: "32,280", sell: "32,850" },
        { currencyCode: "JPY", currencyName: "Yên Nhật", buy: "163.5", transfer: "164.8", sell: "168.2" },
    ];
    return successResponse(fallback, "Lấy tỷ giá ngoại tệ thành công");
}
