import { successResponse } from "@/lib/api-response-helper";
import type { BankItem } from "@/types";

interface VietQRBankResponse {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
}

export async function GET() {
    try {
        // Gọi VietQR Open API (Danh mục dịch vụ công nghệ tài chính Việt Nam từ J2Team catalog)
        const res = await fetch("https://api.vietqr.io/v2/banks", {
            next: { revalidate: 86400 }, // Cache 24h
        });

        if (res.ok) {
            const json = await res.json();
            const rawBanks: VietQRBankResponse[] = json.data || [];
            const banks: BankItem[] = rawBanks.map((b) => ({
                id: b.id,
                name: b.name,
                code: b.code,
                bin: b.bin,
                shortName: b.shortName,
                logo: b.logo,
            }));

            return successResponse(banks, "Lấy danh sách ngân hàng Việt Nam thành công");
        }
    } catch {
        // Fallback
    }

    const fallback: BankItem[] = [
        { id: 1, name: "Ngân hàng TMCP Ngoại Thương Việt Nam", code: "VCB", bin: "970436", shortName: "Vietcombank", logo: "https://api.vietqr.io/img/VCB.png" },
        { id: 2, name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", code: "BIDV", bin: "970418", shortName: "BIDV", logo: "https://api.vietqr.io/img/BIDV.png" },
        { id: 3, name: "Ngân hàng TMCP Công Thương Việt Nam", code: "CTG", bin: "970415", shortName: "VietinBank", logo: "https://api.vietqr.io/img/CTG.png" },
        { id: 4, name: "Ngân hàng TMCP Quân đội", code: "MB", bin: "970422", shortName: "MBBank", logo: "https://api.vietqr.io/img/MB.png" },
        { id: 5, name: "Ngân hàng TMCP Kỹ Thương Việt Nam", code: "TCB", bin: "970407", shortName: "Techcombank", logo: "https://api.vietqr.io/img/TCB.png" },
    ];
    return successResponse(fallback, "Lấy danh sách ngân hàng thành công");
}
