export type ProductStatus = "draft" | "published" | "archived";
export type EnquiryStatus = "new" | "in_progress" | "closed";
export type MediaKind = "image" | "video";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price_label: string | null;
  image_url: string | null;
  status: ProductStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: string;
};

export type MediaAsset = {
  id: string;
  name: string;
  path: string;
  public_url: string;
  kind: MediaKind;
  alt_text: string | null;
  created_at: string;
  uploaded_by: string | null;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      enquiries: {
        Row: Enquiry;
        Insert: Omit<Enquiry, "id" | "created_at">;
        Update: Partial<Pick<Enquiry, "status">>;
        Relationships: [];
      };
      media_assets: {
        Row: MediaAsset;
        Insert: Omit<MediaAsset, "id" | "created_at">;
        Update: Partial<Pick<MediaAsset, "name" | "alt_text">>;
        Relationships: [];
      };
      admin_users: {
        Row: { id: string; email: string; role: string; created_at: string };
        Insert: { id: string; email: string; role?: string };
        Update: Partial<{ email: string; role: string }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
