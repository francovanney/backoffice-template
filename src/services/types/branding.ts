export interface Branding {
  id: number;
  logo_url?: string;
  banner_url?: string;
  icon_url?: string;
}

export interface BrandingFormData {
  logo?: File;
  banner?: File;
  icon?: File;
  logo_url?: string;
  banner_url?: string;
  icon_url?: string;
}
