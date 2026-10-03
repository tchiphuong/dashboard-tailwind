const fs = require("fs");
const path = require("path");

const sqlPath = path.join(
    __dirname,
    "../../../backend/master_seed_functions.sql",
);
const enPath = path.join(__dirname, "en.json");
const viPath = path.join(__dirname, "vi.json");

const sqlContent = fs.readFileSync(sqlPath, "utf8");

const getTitleCase = (str) => {
    return str
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
};

const getViTranslation = (str) => {
    // Very basic mappings
    const map = {
        DASHBOARD: "Trang chủ",
        MASTER_DATA: "Dữ liệu nguồn",
        SALES: "Bán hàng",
        PURCHASING: "Mua hàng",
        INVENTORY: "Kho",
        PRODUCTION: "Sản xuất",
        QUALITY_MANAGEMENT: "Quản lý chất lượng",
        FINANCE_ACCOUNTING: "Tài chính kế toán",
        HUMAN_RESOURCES: "Nhân sự",
        CRM: "Quản lý khách hàng",
        PROJECT_MANAGEMENT: "Quản lý dự án",
        ASSET_MANAGEMENT: "Quản lý tài sản",
        WORKFLOW: "Quy trình",
        DOCUMENT_MANAGEMENT: "Quản lý tài liệu",
        REPORTS: "Báo cáo",
        SYSTEM: "Hệ thống",
        // Common words
        OVERVIEW: "Tổng quan",
        WORKSPACE: "Không gian làm việc",
        REPORTS: "Báo cáo",
        SUMMARY: "Tổng hợp",
        ORGANIZATION: "Tổ chức",
        BUSINESS: "Kinh doanh",
        PARTNERS: "Đối tác",
        PURCHASING: "Mua hàng",
        QUALITY: "Chất lượng",
        FINANCE: "Tài chính",
        HUMAN: "Nhân",
        RESOURCES: "sự",
        ASSETS: "Tài sản",
        PROJECTS: "Dự án",
        COMMON: "Chung",
        QUOTATION: "Báo giá",
        ORDER: "Đơn hàng",
        DELIVERY: "Giao hàng",
        RETURN: "Trả hàng",
        INVOICE: "Hóa đơn",
        REQUEST: "Yêu cầu",
        RECEIPT: "Nhận",
        RECEIVING: "Nhận hàng",
        ISSUING: "Xuất hàng",
        TRANSFER: "Chuyển kho",
        COUNT: "Kiểm kê",
        PLANNING: "Lập kế hoạch",
        EXECUTION: "Thực thi",
        COST: "Chi phí",
        MAINTENANCE: "Bảo trì",
        ASSIGNMENT: "Phân công",
        APPROVAL: "Phê duyệt",
        DELEGATION: "Ủy quyền",
        DOCUMENTS: "Tài liệu",
        CATEGORIES: "Danh mục",
        SEARCH: "Tìm kiếm",
        SECURITY: "Bảo mật",
        NAVIGATION: "Điều hướng",
        CONFIGURATION: "Cấu hình",
        NUMBERING: "Đánh số",
        TEMPLATES: "Mẫu",
        INTEGRATION: "Tích hợp",
        AUDIT: "Nhật ký",
        UTILITIES: "Tiện ích",
    };

    return str
        .split("_")
        .map(
            (word) => map[word] || word.charAt(0) + word.slice(1).toLowerCase(),
        )
        .join(" ");
};

const parseSQL = (content) => {
    const regex =
        /INSERT INTO sy_(modules|function_groups|functions) .*? VALUES \('([^']+)',\s*(?:'[^']+',\s*)?'([^']+)'/g;

    let match;
    const items = [];

    while ((match = regex.exec(content)) !== null) {
        items.push({
            table: match[1],
            code: match[2],
            resourceKey: match[3],
        });
    }

    return items;
};

const items = parseSQL(sqlContent);

const mergeDeep = (target, source) => {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], mergeDeep(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
};

const buildObj = (items, lang) => {
    const root = {};
    for (const item of items) {
        // e.g. module.dashboard -> ['module', 'dashboard']
        const parts = item.resourceKey.split(".");
        let current = root;

        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]];
        }

        const lastPart = parts[parts.length - 1];

        // Remove prefixes from code like DB_, MS_, SA_
        let nameCode = item.code.replace(/^[A-Z]{2}_/, "");

        if (lang === "en") {
            current[lastPart] = getTitleCase(nameCode);
        } else {
            current[lastPart] = getViTranslation(nameCode);
        }
    }
    return root;
};

const enUpdates = buildObj(items, "en");
const viUpdates = buildObj(items, "vi");

const enJson = JSON.parse(fs.readFileSync(enPath, "utf8"));
const viJson = JSON.parse(fs.readFileSync(viPath, "utf8"));

// The updates should be merged into "common" object
enJson.common = mergeDeep(enJson.common || {}, enUpdates);
viJson.common = mergeDeep(viJson.common || {}, viUpdates);

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 4));
fs.writeFileSync(viPath, JSON.stringify(viJson, null, 4));

console.log("Translations updated successfully.");
