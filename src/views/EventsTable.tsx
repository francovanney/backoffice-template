import { useModal } from "@/hooks/useModal";
import { usePagination } from "@/hooks/usePagination";
import EditEventModal from "@/components/EditEventModal";
import { format } from "date-fns";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Star } from "lucide-react";

import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";

import { useShowsQuery } from "@/services/useShowsQuery";
import { Event } from "@/services/types/event";
import { useDeleteShowMutation } from "@/services/useDeleteShowMutation";

interface EventsTableProps {
  search: string;
}

const EventsTable = ({ search }: EventsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useShowsQuery(search, currentPage, pageSize);
  const { openModal, close } = useModal();
  const deleteShowMutation = useDeleteShowMutation();

  const shows = response?.data || [];
  const totalPages = response?.totalPages || 0;
  const total = response?.total || 0;

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
            <TableCell className="w-32">
              <div className="h-4 w-20 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell className="text-center w-24">
              <div className="h-4 w-16 bg-gray-200/80 rounded animate-pulse mx-auto" />
            </TableCell>
            <TableCell className="w-32">
              <div className="h-4 w-20 bg-gray-200/80 rounded animate-pulse" />
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
                  Imagen
                </TableHead>
                <TableHead className="bg-white w-48">Nombre</TableHead>
                <TableHead className="bg-white w-32">Categorías</TableHead>
                <TableHead className="text-center bg-white w-24">
                  Fecha
                </TableHead>
                <TableHead className="bg-white w-32">Venue</TableHead>
                <TableHead className="bg-white w-48">Dirección</TableHead>
                <TableHead className="text-center bg-white w-20">
                  Instagram
                </TableHead>
                <TableHead className="text-center bg-white w-16">Web</TableHead>
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
          Paginacion
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
              <TableHead className="text-center bg-white w-16">
                Imagen
              </TableHead>
              <TableHead className="bg-white w-48">Evento</TableHead>
              <TableHead className="bg-white w-32">Categorías</TableHead>
              <TableHead className="text-center bg-white w-24">Fecha</TableHead>
              <TableHead className="bg-white w-32">Venue</TableHead>
              <TableHead className="bg-white w-48">Dirección</TableHead>
              <TableHead className="text-center bg-white w-20">
                Instagram
              </TableHead>
              <TableHead className="text-center bg-white w-16">Web</TableHead>
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
                <TableCell colSpan={9} className="text-center text-destructive">
                  Error al cargar los shows
                </TableCell>
              </TableRow>
            )}
            {shows && shows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No hay shows disponibles
                </TableCell>
              </TableRow>
            )}
            {shows &&
              shows.length > 0 &&
              shows.map((show: Event) => (
                <TableRow key={show.show_id}>
                  <TableCell className="text-center w-16">
                    <div className="w-10 h-10 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center flex-shrink-0 mx-auto">
                      <img
                        src={show.image_url || ""}
                        alt={show.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium w-48">
                    <div className="flex items-center gap-2">
                      {show.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      <span>{show.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-32">
                    <div className="flex flex-wrap gap-1">
                      {show.categories?.map((cat: string, idx: number) => (
                        <Badge key={cat + idx} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center w-24">
                    {show.event_date
                      ? format(new Date(show.event_date), "dd/MM/yyyy")
                      : ""}
                  </TableCell>
                  <TableCell className="w-32">{show.venue}</TableCell>
                  <TableCell className="w-48">{show.address}</TableCell>
                  <TableCell className="text-center w-20">
                    {show.instagram ? (
                      <a
                        href={`https://www.instagram.com/${show.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramIcon className="mx-auto text-pink-500 hover:scale-110 transition-transform" />
                      </a>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-center w-16">
                    {show.web ? (
                      <a
                        href={show.web}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WebIcon className="mx-auto text-blue-500 hover:scale-110 transition-transform" />
                      </a>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-center w-24">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Editar"
                        onClick={() =>
                          openModal(<EditEventModal show={show} />)
                        }
                      >
                        <EditIcon className="text-primary" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Eliminar"
                        disabled={deleteShowMutation.isPending}
                        onClick={() => {
                          openModal(
                            <ConfirmationModal
                              open={true}
                              onOpenChange={(open: boolean) => !open && close()}
                              title="¿Desea eliminar este evento?"
                              confirmLabel="Eliminar"
                              cancelLabel="Cancelar"
                              onConfirm={() => {
                                deleteShowMutation.mutate(show.show_id, {
                                  onSuccess: () => {
                                    toast.success(
                                      "Evento eliminado correctamente"
                                    );
                                    refetch();
                                  },
                                  onError: () => {
                                    toast.error("Error al eliminar el evento");
                                  },
                                  onSettled: () => {
                                    close();
                                  },
                                });
                              }}
                              onCancel={close}
                              isLoading={deleteShowMutation.isPending}
                            >
                              <div className="py-2 text-center text-sm text-gray-700">
                                {show.title}
                              </div>
                            </ConfirmationModal>
                          );
                        }}
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

export default EventsTable;
