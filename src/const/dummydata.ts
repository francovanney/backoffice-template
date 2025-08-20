// Interfaz para Spots
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

// Interfaz para Events
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

// Datos dummy de Spots
export const dummySpots: Spot[] = [
  {
    id: 1,
    nombre: "Restaurante El Parador",
    direccion: "Av. Corrientes 1234, Buenos Aires",
    link_direccion: "https://maps.google.com/corrientes1234",
    telefono: "+54 11 4567-8900",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "Restaurante de comida tradicional argentina",
    reservas: "https://reservas.elparador.com",
    menu: "https://menu.elparador.com",
    delivery: "https://delivery.elparador.com",
    web: "https://elparador.com.ar",
    is_featured: true,
    instagram: "elparador",
    youtube: "elparadorok",
    seccion_id: 1,
    seccion_nombre: "Restaurantes",
    seccion_padre: "comer",
  },
  {
    id: 2,
    nombre: "Café Central",
    direccion: "San Martín 567, Rosario",
    link_direccion: "https://maps.google.com/sanmartin567",
    telefono: "+54 341 456-7890",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "Café tradicional del centro de Rosario",
    reservas: "",
    menu: "https://menu.cafecentral.com",
    delivery: "",
    web: "https://cafecentral.com",
    is_featured: false,
    instagram: "cafecentral",
    youtube: "",
    seccion_id: 1,
    seccion_nombre: "Restaurantes",
    seccion_padre: "comer",
  },
  {
    id: 3,
    nombre: "Hotel Plaza",
    direccion: "Plaza San Martín 123, Córdoba",
    link_direccion: "https://maps.google.com/plazasanmartin123",
    telefono: "+54 351 789-0123",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "Hotel 4 estrellas en el centro de Córdoba",
    reservas: "https://reservas.hotelplaza.com",
    menu: "",
    delivery: "",
    web: "https://hotelplaza.com.ar",
    is_featured: true,
    instagram: "hotelplaza",
    youtube: "hotelplazacordoba",
    seccion_id: 5,
    seccion_nombre: "Hoteles",
    seccion_padre: "dormir",
  },
  {
    id: 4,
    nombre: "Bar La Esquina",
    direccion: "Pellegrini 890, Mendoza",
    link_direccion: "https://maps.google.com/pellegrini890",
    telefono: "+54 261 234-5678",
    logo_url: "",
    descripcion: "Bar de barrio con ambiente familiar",
    reservas: "",
    menu: "",
    delivery: "",
    web: "",
    is_featured: false,
    instagram: "",
    youtube: "",
    seccion_id: 3,
    seccion_nombre: "Bares",
    seccion_padre: "salir",
  },
  {
    id: 5,
    nombre: "Parrilla Don Juan",
    direccion: "Maipú 456, Mar del Plata",
    link_direccion: "https://maps.google.com/maipu456",
    telefono: "",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "Parrilla tradicional frente al mar",
    reservas: "https://reservas.parrilladonjuan.com",
    menu: "https://menu.parrilladonjuan.com",
    delivery: "https://delivery.parrilladonjuan.com",
    web: "https://parrilladonjuan.com",
    is_featured: false,
    instagram: "parrilladonjuan",
    youtube: "",
    seccion_id: 1,
    seccion_nombre: "Restaurantes",
    seccion_padre: "comer",
  },
  {
    id: 6,
    nombre: "Discoteca Neon",
    direccion: "Av. Libertador 2200, Buenos Aires",
    link_direccion: "https://maps.google.com/libertador2200",
    telefono: "+54 11 5678-9012",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "La mejor música electrónica de la ciudad",
    reservas: "https://reservas.disconeon.com",
    menu: "",
    delivery: "",
    web: "https://disconeon.com.ar",
    is_featured: true,
    instagram: "disconeon",
    youtube: "disconeonba",
    seccion_id: 3,
    seccion_nombre: "Bares",
    seccion_padre: "salir",
  },
  {
    id: 7,
    nombre: "Hostería Las Rosas",
    direccion: "Ruta Nacional 40 Km 1820, Bariloche",
    link_direccion: "https://maps.google.com/ruta40km1820",
    telefono: "+54 294 567-8901",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "Hostería con vista al lago Nahuel Huapi",
    reservas: "https://reservas.hosteriasrosas.com",
    menu: "",
    delivery: "",
    web: "https://hosteriasrosas.com.ar",
    is_featured: true,
    instagram: "hosteriasrosas",
    youtube: "",
    seccion_id: 5,
    seccion_nombre: "Hoteles",
    seccion_padre: "dormir",
  },
  {
    id: 8,
    nombre: "Centro Comercial Palermo",
    direccion: "Av. Santa Fe 3200, Buenos Aires",
    link_direccion: "https://maps.google.com/santafe3200",
    telefono: "+54 11 4321-0987",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "Shopping center con las mejores marcas",
    reservas: "",
    menu: "",
    delivery: "",
    web: "https://ccpalermo.com.ar",
    is_featured: false,
    instagram: "ccpalermo",
    youtube: "",
    seccion_id: 7,
    seccion_nombre: "Shopping",
    seccion_padre: "comercios",
  },
  {
    id: 9,
    nombre: "Museo de Arte Moderno",
    direccion: "San Juan 350, Buenos Aires",
    link_direccion: "https://maps.google.com/sanjuan350",
    telefono: "+54 11 4342-3001",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "Museo con obras de arte contemporáneo",
    reservas: "",
    menu: "",
    delivery: "",
    web: "https://museomoderno.org",
    is_featured: true,
    instagram: "museomoderno",
    youtube: "museomodernoBA",
    seccion_id: 9,
    seccion_nombre: "Museos",
    seccion_padre: "actividades",
  },
  {
    id: 10,
    nombre: "Parque de Diversiones Fantasía",
    direccion: "Costanera Sur s/n, Buenos Aires",
    link_direccion: "https://maps.google.com/costanerasur",
    telefono: "+54 11 4567-1234",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "Parque temático para toda la familia",
    reservas: "https://reservas.parquefantasia.com",
    menu: "",
    delivery: "",
    web: "https://parquefantasia.com.ar",
    is_featured: false,
    instagram: "parquefantasia",
    youtube: "parquefantasiaBA",
    seccion_id: 9,
    seccion_nombre: "Museos",
    seccion_padre: "actividades",
  },
  {
    id: 20,
    nombre: "Parque de Diversiones Fantasía",
    direccion: "Costanera Sur s/n, Buenos Aires",
    link_direccion: "https://maps.google.com/costanerasur",
    telefono: "+54 11 4567-1234",
    logo_url: "https://via.placeholder.com/40",
    descripcion: "Parque temático para toda la familia",
    reservas: "https://reservas.parquefantasia.com",
    menu: "",
    delivery: "",
    web: "https://parquefantasia.com.ar",
    is_featured: false,
    instagram: "parquefantasia",
    youtube: "parquefantasiaBA",
    seccion_id: 10,
    seccion_nombre: "Museos",
    seccion_padre: "comer",
  },
];
