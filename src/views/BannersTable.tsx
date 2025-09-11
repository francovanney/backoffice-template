import { useState, useEffect } from "react";
import toast from "react-hot-toast";

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
  WebIcon,
  EditIcon,
  DeleteIcon,
} from "@/components/ui/icons";
import ConfirmationModal from "@/components/ConfirmationModal";
import EditBannerModal from "@/components/EditBannerModal";

import { useModal } from "@/hooks/useModal";
import { usePagination } from "@/hooks/usePagination";

// Hooks análogos a los de shows
import { useBannersQuery } from "@/services/useBannersQuery";
import { useDeleteBannerMutation } from "@/services/useDeleteBannerMutation";

interface EventsTableProps {
    search: string;
  }

const BannersTable = ({ search }: EventsTableProps)  => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useBannersQuery(search, currentPage, pageSize);

  const { openModal, close } = useModal();
  const deleteBannerMutation = useDeleteBannerMutation();

  const banners = response?.data || [];
  const totalPages = response?.totalPages || 0;
  const total = response?.total || 0;

  const { pageNumbers, hasPrevious, hasNext, showPagination } = usePagination({
    currentPage,
    totalPages,
  });

  const formatUrl = (url?: string | null): string | undefined => {
    if (!url) return undefined;                 
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const SkeletonTableRows = () => (
    <>
      {Array.from({ length: pageSize }).map((_, i) => (
        <TableRow key={"skeleton-" + i}>
          <TableCell className="text-center w-16">
            <div className="w-10 h-10 rounded-md bg-gray-200/80 animate-pulse border flex-shrink-0 mx-auto" />
          </TableCell>
          <TableCell className="font-medium w-64">
            <div className="h-4 w-40 bg-gray-200/80 rounded animate-pulse" />
          </TableCell>
          <TableCell className="w-64">
            <div className="h-4 w-48 bg-gray-200/80 rounded animate-pulse" />
          </TableCell>
          <TableCell className="text-center w-24">
            <div className="h-4 w-10 bg-gray-200/80 rounded animate-pulse mx-auto" />
          </TableCell>
          <TableCell className="text-center w-24">
            <div className="h-5 w-12 bg-gray-200/80 rounded mx-auto animate-pulse" />
          </TableCell>
          <TableCell className="w-40">
            <div className="h-4 w-32 bg-gray-200/80 rounded animate-pulse" />
          </TableCell>
          <TableCell className="w-40">
            <div className="h-4 w-32 bg-gray-200/80 rounded animate-pulse" />
          </TableCell>
          <TableCell className="text-center w-24">
            <div className="flex gap-2 justify-center">
              <div className="h-8 w-8 rounded-md bg-gray-200/80 animate-pulse" />
              <div className="h-8 w-8 rounded-md bg-gray-200/80 animate-pulse" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 bg-white border-b shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center bg-white w-16">Imagen</TableHead>
                <TableHead className="bg-white w-48">Nombre</TableHead>
                <TableHead className="bg-white w-64 hidden lg:table-cell">URL</TableHead>
                <TableHead className="text-center bg-white w-24 hidden lg:table-cell">Orden</TableHead>
                <TableHead className="text-center bg-white w-24 hidden lg:table-cell">Disponible</TableHead>
                <TableHead className="text-center bg-white w-24">Acciones</TableHead>
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
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 bg-white border-b shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center bg-white w-16">Imagen</TableHead>
              <TableHead className="bg-white w-48">Nombre</TableHead>
              <TableHead className="bg-white w-64 hidden lg:table-cell">URL</TableHead>
              <TableHead className="text-center bg-white w-24 hidden lg:table-cell">Orden</TableHead>
              <TableHead className="text-center bg-white w-24 hidden lg:table-cell">Disponible</TableHead>
              <TableHead className="text-center bg-white w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableBody>
            {isError && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-destructive">
                  Error al cargar los banners
                </TableCell>
              </TableRow>
            )}

            {banners && banners.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No hay banners disponibles
                </TableCell>
              </TableRow>
            )}

            {banners && banners.length > 0 && banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell className="text-center w-16">
                  <div className="w-10 h-10 rounded-md overflow-hidden border bg-gray-100 flex items-center justify-center flex-shrink-0 mx-auto">
                    {banner.image_url ? (
                      <img
                        src={banner.image_url}
                        alt={banner.banner_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>
                </TableCell>

                <TableCell className="font-medium w-48">
                  <span>{banner.banner_name}</span>
                </TableCell>

                <TableCell className="w-64 hidden lg:table-cell">
                    {banner.banner_url ? (
                        <a
                        href={formatUrl(banner.banner_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                        >
                        <WebIcon className="h-4 w-4" />
                        <span className="truncate max-w-[220px]">{banner.banner_url}</span>
                        </a>
                    ) : (
                        <span className="text-muted-foreground">—</span>
                    )}
                </TableCell>

                <TableCell className="text-center w-24 hidden lg:table-cell">
                  {banner.banner_order ?? 0}
                </TableCell>

                <TableCell className="text-center w-24 hidden lg:table-cell">
                  <Badge variant={banner.available ? "default" : "secondary"}
                         className={banner.available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}>
                    {banner.available ? "Sí" : "No"}
                  </Badge>
                </TableCell>

                <TableCell className="text-center w-24">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Editar"
                      onClick={() => openModal(<EditBannerModal banner={banner} />)}
                    >
                      <EditIcon className="text-primary" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Eliminar"
                      disabled={deleteBannerMutation.isPending}
                      onClick={() => {
                        openModal(
                          <ConfirmationModal
                            open={true}
                            onOpenChange={(open: boolean) => !open && close()}
                            title="¿Desea eliminar este banner?"
                            confirmLabel="Eliminar"
                            cancelLabel="Cancelar"
                            onConfirm={() => {
                              deleteBannerMutation.mutate(banner.id, {
                                onSuccess: () => {
                                  toast.success("Banner eliminado correctamente");
                                  refetch();
                                },
                                onError: () => {
                                  toast.error("Error al eliminar el banner");
                                },
                                onSettled: () => {
                                  close();
                                },
                              });
                            }}
                            onCancel={close}
                            isLoading={deleteBannerMutation.isPending}
                          >
                            <div className="py-2 text-center text-sm text-gray-700">
                              {banner.banner_name}
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
        <div className="flex flex-col gap-3 md:relative">
          <div className="text-xs text-muted-foreground text-center md:text-left md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 hidden md:block">
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
                    className={!hasPrevious ? "pointer-events-none opacity-50" : ""}
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

export default BannersTable;
