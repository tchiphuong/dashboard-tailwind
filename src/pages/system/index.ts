// Export existing pages if any (need to check if other system pages exist in this folder or if we should append)
// Assuming we are managing exports here.
// Note: If 'system' folder already existed with other pages, we should append.
// I'll check if it exists first in next step or use 'create' if not.
// SAFEST: Let's assume we are adding to potential existing, but since I am creating new file, I will just export my new ones.
// WAIT: There might be existing system pages (e.g. Settings).
// I will check using 'list_dir' before writing this index file to be safe.
// But for now, I will write these exports to a temp file content and merge later or just append.
// Actually, I'll invoke 'list_dir' first in a separate turn if I was unsure, but I see 'Settings' is in `src/pages/settings/index`.
// So `src/pages/system` is likely new or empty.
// Let's create it.

export * from './AuditLog';
export * from './Profile';
export * from './HelpCenter';
