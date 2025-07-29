import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import EditEventModal from "@/components/EditEventModal";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  InstagramIcon,
  WebIcon,
  EditIcon,
  DeleteIcon,
} from "@/components/ui/icons";

import Filter from "@/components/Filter";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";

import { useShowsQuery } from "@/services/useShowsQuery";
import { Event } from "@/services/types/event";
import { useDeleteShowMutation } from "@/services/useDeleteShowMutation";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const TableUI = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 600);
  const {
    data: shows,
    isLoading,
    isError,
    refetch,
  } = useShowsQuery(debouncedSearch);
  const { openModal, close } = useModal();
  const deleteShowMutation = useDeleteShowMutation();

  const SkeletonTableRows = () => {
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRow key={"skeleton-" + i}>
            <TableCell>
              <div className="w-10 h-10 rounded-full bg-gray-200/80 animate-pulse border" />
            </TableCell>
            <TableCell className="font-medium">
              <div className="h-4 w-24 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-20 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-16 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-20 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-28 bg-gray-200/80 rounded animate-pulse" />
            </TableCell>
            <TableCell className="text-center">
              <div className="h-6 w-6 mx-auto bg-gray-200/80 rounded-full animate-pulse" />
            </TableCell>
            <TableCell className="text-center">
              <div className="h-6 w-6 mx-auto bg-gray-200/80 rounded-full animate-pulse" />
            </TableCell>
            <TableCell className="flex gap-2 justify-center">
              <div className="h-8 w-8 rounded-full bg-gray-200/80 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-gray-200/80 animate-pulse" />
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <Filter search={search} setSearch={setSearch} />
        <Table>
          <TableCaption>Lista de shows.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categorías</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="text-center">Instagram</TableHead>
              <TableHead className="text-center">Web</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonTableRows />
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Filter search={search} setSearch={setSearch} />
      <Table>
        <TableCaption>Lista de shows.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead>Categorías</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead className="text-center">Instagram</TableHead>
            <TableHead className="text-center">Web</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
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
          {Array.isArray(shows) &&
            shows.map((show: Event) => (
              <TableRow key={show.show_id}>
                <TableCell>
                  <img
                    src={show.image_url || ""}
                    alt={show.title}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </TableCell>
                <TableCell className="font-medium">{show.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {show.categories?.map((cat: string, idx: number) => (
                      <Badge key={cat + idx} variant="secondary">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {show.event_date
                    ? format(new Date(show.event_date), "dd/MM/yyyy")
                    : ""}
                </TableCell>
                <TableCell>{show.venue}</TableCell>
                <TableCell>{show.address}</TableCell>
                <TableCell className="text-center">
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
                <TableCell className="text-center">
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
                <TableCell className="flex gap-2 justify-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Editar"
                    onClick={() => openModal(<EditEventModal show={show} />)}
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
                                toast.success("Evento eliminado correctamente");
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
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableUI;
