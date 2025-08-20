// React imports
import { useState, useEffect } from "react";

// External libraries
import { Phone } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import toast from "react-hot-toast";

// UI Components
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

// App Components
import ConfirmationModal from "@/components/ConfirmationModal";
import EditSpotModal from "@/components/EditSpotModal";

// Hooks & Services
import { useModal } from "@/hooks/useModal";
import { usePagination } from "@/hooks/usePagination";
import { useSpotsQuery } from "@/services/useSpotsQuery";
import { useDeleteSpotMutation } from "@/services/useDeleteSpotMutation";
import { type Spot } from "@/services/types/spot";

interface SpotsTableProps {
  search?: string;
  seccionPadre?: string;
  seccionId?: number | null;
}

const SpotsTable = ({
  search = "",
  seccionPadre,
  seccionId,
}: SpotsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const {
    data: allSpots,
    isLoading,
    error: isError,
  } = useSpotsQuery(seccionPadre || "");

  const filteredSpots =
    seccionId && allSpots
      ? allSpots.filter((spot: Spot) => spot.seccion_id === seccionId)
      : allSpots || [];

  const searchFilteredSpots = search
    ? filteredSpots.filter(
        (spot: Spot) =>
          spot.nombre.toLowerCase().includes(search.toLowerCase()) ||
          spot.direccion.toLowerCase().includes(search.toLowerCase())
      )
    : filteredSpots;

  const totalPages = Math.ceil(searchFilteredSpots.length / pageSize);
  const total = searchFilteredSpots.length;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSpots = searchFilteredSpots.slice(startIndex, endIndex);

  const { openModal, close } = useModal();
  const deleteSpotMutation = useDeleteSpotMutation();

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
        title="¿Desea eliminar este comercio?"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={() => {
          deleteSpotMutation.mutate(
            { id: spot.id, seccionPadre: seccionPadre || "" },
            {
              onSuccess: () => {
                toast.success("Comercio eliminado correctamente");
                close();
              },
              onError: (error) => {
                console.error("Error al eliminar comercio:", error);
                toast.error("Error al eliminar comercio");
                close();
              },
            }
          );
        }}
        onCancel={close}
        isLoading={deleteSpotMutation.isPending}
      >
        <div className="py-2 text-center text-sm text-gray-700">
          {spot.nombre}
        </div>
      </ConfirmationModal>
    );
  };

  const handleEdit = (spot: Spot) => {
    openModal(<EditSpotModal spot={spot} />);
  };

  const SkeletonTableRows = () => {
    return (
      <>
        {Array.from({ length: pageSize }).map((_, i) => (
          <TableRow key={"skeleton-" + i}>
            <TableCell className="text-center w-16 hidden md:table-cell">
              <div className="w-10 h-10 rounded-full bg-gray-200/80 animate-pulse border flex-shrink-0 mx-auto" />
            </TableCell>
            <TableCell className="font-medium w-48">
              <div className="h-4 w-24 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell className="w-48 hidden md:table-cell">
              <div className="h-4 w-28 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell className="text-center w-20 hidden md:table-cell">
              <div className="h-6 w-6 mx-auto bg-gray-200/80 rounded-full animate-pulse" />
            </TableCell>
            <TableCell className="text-center w-16 hidden md:table-cell">
              <div className="h-6 w-6 mx-auto bg-gray-200/80 rounded-full animate-pulse" />
            </TableCell>
            <TableCell className="text-center w-20 hidden md:table-cell">
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
      <div className="w-full h-full flex flex-col relative">
        <div className="flex-shrink-0 bg-white border-b shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center bg-white w-16 hidden md:table-cell">
                  Logo
                </TableHead>
                <TableHead className="bg-white w-48">Nombre</TableHead>
                <TableHead className="bg-white w-48 hidden md:table-cell">
                  Dirección
                </TableHead>
                <TableHead className="text-center bg-white w-20 hidden md:table-cell">
                  Instagram
                </TableHead>
                <TableHead className="text-center bg-white w-16 hidden md:table-cell">
                  Web
                </TableHead>
                <TableHead className="text-center bg-white w-20 hidden md:table-cell">
                  Teléfono
                </TableHead>
                <TableHead className="text-center bg-white w-24">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="flex-1 overflow-auto relative z-0">
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
    <div className="w-full h-full flex flex-col relative">
      <div className="flex-shrink-0 bg-white border-b shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center bg-white w-16 hidden md:table-cell">
                Logo
              </TableHead>
              <TableHead className="bg-white w-48">Nombre</TableHead>
              <TableHead className="bg-white w-48 hidden md:table-cell">
                Dirección
              </TableHead>
              <TableHead className="text-center bg-white w-20 hidden md:table-cell">
                Instagram
              </TableHead>
              <TableHead className="text-center bg-white w-16 hidden md:table-cell">
                Web
              </TableHead>
              <TableHead className="text-center bg-white w-20 hidden md:table-cell">
                Teléfono
              </TableHead>
              <TableHead className="text-center bg-white w-24">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div className="flex-1 overflow-auto relative z-0">
        <Table>
          <TableBody>
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Error al cargar los comercios
                </TableCell>
              </TableRow>
            )}
            {paginatedSpots && paginatedSpots.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No hay comercios disponibles
                </TableCell>
              </TableRow>
            )}
            {paginatedSpots &&
              paginatedSpots.length > 0 &&
              paginatedSpots.map((spot: Spot) => (
                <TableRow key={spot.id}>
                  <TableCell className="text-center w-16 hidden md:table-cell">
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
                  <TableCell className="w-48 hidden md:table-cell">
                    {spot.direccion}
                  </TableCell>
                  <TableCell className="text-center w-20 hidden md:table-cell">
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
                  <TableCell className="text-center w-16 hidden md:table-cell">
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
                  <TableCell className="text-center w-20 hidden md:table-cell">
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
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Editar"
                            onClick={() => handleEdit(spot)}
                          >
                            <EditIcon className="text-primary" />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          sideOffset={8}
                          className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg z-50"
                        >
                          Editar comercio
                        </Tooltip.Content>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Eliminar"
                            onClick={() => handleDelete(spot)}
                          >
                            <DeleteIcon className="text-destructive" />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          sideOffset={8}
                          className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg z-50"
                        >
                          Eliminar comercio
                        </Tooltip.Content>
                      </Tooltip.Root>
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
            Mostrando {total} resultado{total !== 1 ? "s" : ""}
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
