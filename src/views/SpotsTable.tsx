import { useModal } from "@/hooks/useModal";
import { usePagination } from "@/hooks/usePagination";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  InstagramIcon,
  WebIcon,
  EditIcon,
  DeleteIcon,
} from "@/components/ui/icons";
import { Phone } from "lucide-react";

import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";

// Interfaz basada en la API real
interface Spot {
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

interface SpotsTableProps {
  search?: string;
  seccionPadre?: string;
}

const SpotsTable = ({ search = "", seccionPadre }: SpotsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // TODO: Reemplazar con el servicio real de spots
  const isLoading = false;
  const isError = false;

  // Datos dummy para pruebas basados en la estructura real de la API
  const spots: Spot[] = [
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
      seccion_id: 2,
      seccion_nombre: "Eventos",
      seccion_padre: "comer",
    },
  ];

  // Filtrar spots por seccion_padre si se proporciona
  const filteredSpots = seccionPadre
    ? spots.filter((spot) => spot.seccion_padre === seccionPadre)
    : spots;

  const totalPages = 1;
  const total = filteredSpots.length;

  const { openModal, close } = useModal();

  const { pageNumbers, hasPrevious, hasNext, showPagination } = usePagination({
    currentPage,
    totalPages,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (spot: Spot) => {
    openModal(
      <ConfirmationModal
        open={true}
        onOpenChange={(open: boolean) => !open && close()}
        title="¿Desea eliminar este spot?"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={() => {
          // TODO: Implementar lógica de eliminación
          toast.success("Spot eliminado correctamente");
          close();
        }}
        onCancel={close}
        isLoading={false}
      >
        <div className="py-2 text-center text-sm text-gray-700">
          {spot.nombre}
        </div>
      </ConfirmationModal>
    );
  };

  const handleEdit = (spot: Spot) => {
    // TODO: Implementar modal de edición
    console.log("Editar spot:", spot);
  };

  const SkeletonTableRows = () => {
    return (
      <>
        {Array.from({ length: pageSize }).map((_, i) => (
          <TableRow key={"skeleton-" + i}>
            <TableCell className="text-center w-16">
              <div className="w-10 h-10 rounded-full bg-gray-200/80 animate-pulse border flex-shrink-0 mx-auto" />
            </TableCell>
            <TableCell className="font-medium w-48">
              <div className="h-4 w-24 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell className="w-48">
              <div className="h-4 w-28 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell className="text-center w-20">
              <div className="h-6 w-6 mx-auto bg-gray-200/80 rounded-full animate-pulse" />
            </TableCell>
            <TableCell className="text-center w-16">
              <div className="h-6 w-6 mx-auto bg-gray-200/80 rounded-full animate-pulse" />
            </TableCell>
            <TableCell className="text-center w-20">
              <div className="h-6 w-6 mx-auto bg-gray-200/80 rounded-full animate-pulse" />
            </TableCell>
            <TableCell className="text-center w-24">
              <div className="flex gap-2 justify-center">
                <div className="h-8 w-8 rounded-full bg-gray-200/80 animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-gray-200/80 animate-pulse" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-shrink-0 bg-white border-b shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center bg-white w-16">
                  Logo
                </TableHead>
                <TableHead className="bg-white w-48">Nombre</TableHead>
                <TableHead className="bg-white w-48">Dirección</TableHead>
                <TableHead className="text-center bg-white w-20">
                  Instagram
                </TableHead>
                <TableHead className="text-center bg-white w-16">Web</TableHead>
                <TableHead className="text-center bg-white w-20">
                  Teléfono
                </TableHead>
                <TableHead className="text-center bg-white w-24">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableBody>
              <SkeletonTableRows />
            </TableBody>
          </Table>
        </div>

        <div className="flex-shrink-0 p-4 text-center text-sm text-muted-foreground">
          Paginación
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 bg-white border-b shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center bg-white w-16">Logo</TableHead>
              <TableHead className="bg-white w-48">Nombre</TableHead>
              <TableHead className="bg-white w-48">Dirección</TableHead>
              <TableHead className="text-center bg-white w-20">
                Instagram
              </TableHead>
              <TableHead className="text-center bg-white w-16">Web</TableHead>
              <TableHead className="text-center bg-white w-20">
                Teléfono
              </TableHead>
              <TableHead className="text-center bg-white w-24">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableBody>
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-destructive">
                  Error al cargar los spots
                </TableCell>
              </TableRow>
            )}
            {filteredSpots && filteredSpots.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No hay spots disponibles
                </TableCell>
              </TableRow>
            )}
            {filteredSpots &&
              filteredSpots.length > 0 &&
              filteredSpots.map((spot: Spot) => (
                <TableRow key={spot.id}>
                  <TableCell className="text-center w-16">
                    <div className="w-10 h-10 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center flex-shrink-0 mx-auto">
                      <img
                        src={spot.logo_url || ""}
                        alt={spot.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium w-48">
                    <span>{spot.nombre}</span>
                  </TableCell>
                  <TableCell className="w-48">{spot.direccion}</TableCell>
                  <TableCell className="text-center w-20">
                    {spot.instagram ? (
                      <a
                        href={`https://www.instagram.com/${spot.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramIcon className="mx-auto text-pink-500 hover:scale-110 transition-transform" />
                      </a>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-center w-16">
                    {spot.web ? (
                      <a
                        href={spot.web}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WebIcon className="mx-auto text-blue-500 hover:scale-110 transition-transform" />
                      </a>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-center w-20">
                    {spot.telefono ? (
                      <a
                        href={`tel:${spot.telefono}`}
                        className="text-green-500 hover:scale-110 transition-transform inline-block"
                      >
                        <Phone className="h-5 w-5 mx-auto" />
                      </a>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-center w-24">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Editar"
                        onClick={() => handleEdit(spot)}
                      >
                        <EditIcon className="text-primary" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Eliminar"
                        onClick={() => handleDelete(spot)}
                      >
                        <DeleteIcon className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex-shrink-0 p-4 border-t bg-white">
        <div className="relative flex items-center justify-center">
          <div className="absolute left-0 text-xs text-muted-foreground">
            Mostrando {(currentPage - 1) * pageSize + 1} a{" "}
            {Math.min(currentPage * pageSize, total)} de {total} resultados
          </div>

          {showPagination && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasPrevious) handlePageChange(currentPage - 1);
                    }}
                    className={
                      !hasPrevious ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {pageNumbers.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page as number);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasNext) handlePageChange(currentPage + 1);
                    }}
                    className={!hasNext ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotsTable;
