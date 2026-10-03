/**
 * System Settings Types
 */

export interface GeneralSettings {
    systemName: string;
    systemLogo?: string;
    timezone: string;
    defaultLanguage: string;
    dateFormat: string;
    timeFormat: string;
}

export interface EmailSettings {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpUseSsl: boolean;
    fromEmail: string;
    fromName: string;
}

export interface SecuritySettings {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireLowercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    enableTwoFactor: boolean;
}

export interface AppearanceSettings {
    theme: "light" | "dark" | "auto";
    primaryColor: string;
    accentColor: string;
    borderRadius: "none" | "small" | "medium" | "large";
}

export interface SystemSettings {
    general: GeneralSettings;
    email: EmailSettings;
    security: SecuritySettings;
    appearance: AppearanceSettings;
}
