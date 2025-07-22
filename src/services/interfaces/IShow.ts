export interface IShow {
  show_id: number;
  title: string;
  venue: string;
  event_date: string;
  city: string;
  url: string;
  end_date: string | null;
  start_date: string | null;
  completedevent: boolean | null;
  categories: string[];
  instagram: string;
  web: string;
  address: string;
  image_url: string;
}

// Interfaz para la respuesta paginada de shows
export interface IPaginatedShows {
  data: IShow[];
  page?: number;
  perPage?: number;
  total?: number;
  [key: string]: unknown;
}
