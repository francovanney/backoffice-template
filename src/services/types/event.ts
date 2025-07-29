export interface Event {
  show_id: number;
  title: string;
  venue: string;
  event_date: string;
  city: string | null;
  url: string | null;
  end_date: string | null;
  start_date: string | null;
  completedevent: unknown | null;
  categories: string[];
  instagram: string | null;
  web: string | null;
  address: string | null;
  image_url: string | null;
  is_featured: boolean;
  youtube: string | null;
  description: string | null;
}
