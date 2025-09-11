export interface Banner {
    id: number;
    image_url: string | null;
    banner_name: string;
    banner_url: string | null;
    banner_order: number;
    available: boolean;
    created_at: string | null;
    updated_at: string | null;
  }