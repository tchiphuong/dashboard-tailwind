import { successResponse } from "@/lib/api-response-helper";
import type { PetrolItem } from "@/types";

export async function GET() {
    // Giá xăng dầu Petrolimex Việt Nam
    const petrolPrices: PetrolItem[] = [
        { type: "Xăng RON 95-III", price: "21,800 đ/lít", change: "+150 đ" },
        { type: "Xăng E5 RON 92-II", price: "20,950 đ/lít", change: "+120 đ" },
        { type: "Dầu Điêzen 0,05S-II (DO)", price: "19,450 đ/lít", change: "-80 đ" },
        { type: "Dầu Hỏa 2-KO", price: "19,850 đ/lít", change: "-50 đ" },
        { type: "Dầu Mazút 180CST 3,5S", price: "17,200 đ/kg", change: "+210 đ" },
    ];

    return successResponse(petrolPrices, "Lấy giá xăng dầu Petrolimex thành công");
}
