import { successResponse } from "@/lib/api-response-helper";
import type { GoldPriceItem } from "@/types";

export async function GET() {
    // Giá vàng thị trường Việt Nam (SJC, DOJI, PNJ, 9999)
    const goldPrices: GoldPriceItem[] = [
        { type: "SJC 1L - 10L (TP.HCM)", buy: "81,500,000", sell: "83,500,000", company: "SJC" },
        { type: "SJC (Hà Nội)", buy: "81,500,000", sell: "83,520,000", company: "SJC" },
        { type: "DOJI AVPL / SJC", buy: "81,400,000", sell: "83,400,000", company: "DOJI" },
        { type: "Nhẫn Tròn Trơn 999.9 (Hưng Thịnh Vượng)", buy: "76,800,000", sell: "78,200,000", company: "DOJI" },
        { type: "PNJ Vàng Nữ Trang 99.99%", buy: "76,500,000", sell: "77,900,000", company: "PNJ" },
        { type: "Vàng Nữ Trang 75% (18K)", buy: "57,100,000", sell: "58,500,000", company: "PNJ" },
    ];

    return successResponse(goldPrices, "Lấy giá vàng Việt Nam thành công");
}
