// Interfaz para la respuesta de la API de lugares/spots
export interface Spot {
  id: number;
  nombre: string;
  direccion: string;
  link_direccion: string;
  telefono: string;
  logo_url: string;
  descripcion: string;
  reservas: string;
  menu: string;
  delivery: string;
  web: string;
  is_featured: boolean;
  instagram: string;
  youtube: string;
  seccion_id: number;
  seccion_nombre: string;
  seccion_padre: string;
}
