import { useState } from "react";
import {
  Utensils,
  BedDouble,
  Martini,
  Store,
  TicketCheck,
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import toast from "react-hot-toast";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrum";
import ConfirmationModal from "@/components/ConfirmationModal";
import NewSectionModal from "@/components/NewSectionModal";
import EditSectionModal from "@/components/EditSectionModal";
import NewSpotModal from "@/components/NewSpotModal";
import SpotsTable from "./SpotsTable";

import { useModal } from "@/hooks/useModal";
import { useGetSectionsQuery } from "@/services/useGetSectionsQuery";
import { useSpotsQuery } from "@/services/useSpotsQuery";
import { useDeleteSectionMutation } from "@/services/useDeleteSectionMutation";
import { SECTION_TYPES } from "@/const/sectionsTypes";

const SectionTypeCard = ({
  sectionType,
  onClick,
  isActive,
}: {
  sectionType: string;
  onClick: () => void;
  isActive: boolean;
}) => {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "salir":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      case "comer":
        return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200";
      case "dormir":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "actividades":
        return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
      case "comercios":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border shadow-sm p-6 transition-all duration-200 ${getBadgeColor(
        sectionType
      )} ${
        isActive
          ? "ring-2 ring-offset-2 ring-blue-500 shadow-lg scale-105"
          : "hover:shadow-md"
      }`}
    >
      <div className="text-center">
        <div className="flex justify-center mb-2">
          {sectionType === "comer" ? (
            <Utensils className="h-8 w-8 text-orange-600" />
          ) : sectionType === "dormir" ? (
            <BedDouble className="h-8 w-8 text-blue-600" />
          ) : sectionType === "salir" ? (
            <Martini className="h-8 w-8 text-green-600" />
          ) : sectionType === "comercios" ? (
            <Store className="h-8 w-8 text-yellow-600" />
          ) : sectionType === "actividades" ? (
            <TicketCheck className="h-8 w-8 text-purple-600" />
          ) : (
            ""
          )}
        </div>
        <h3 className="text-lg font-semibold capitalize">{sectionType}</h3>
      </div>
    </div>
  );
};

const Spots = () => {
  const [selectedSectionType, setSelectedSectionType] = useState<string | null>(
    null
  );
  const [openSubsections, setOpenSubsections] = useState<Set<number>>(
    new Set()
  );
  const [isNewSectionModalOpen, setIsNewSectionModalOpen] = useState(false);
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<{
    id: number;
    nombre: string;
    seccion_padre: string;
  } | null>(null);

  const deleteSectionMutation = useDeleteSectionMutation();
  const { openModal, close } = useModal();

  const {
    data: secciones,
    isLoading,
    error,
  } = useGetSectionsQuery(selectedSectionType || "");

  const { data: allSpots } = useSpotsQuery(selectedSectionType || "");

  const getSpotCountForSection = (sectionId: number) => {
    if (!allSpots) return 0;
    return allSpots.filter((spot) => spot.seccion_id === sectionId).length;
  };

  const handleSectionTypeClick = (sectionType: string) => {
    setSelectedSectionType(sectionType);
    setOpenSubsections(new Set());
  };

  const toggleSubsection = (subsectionId: number) => {
    setOpenSubsections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subsectionId)) {
        newSet.delete(subsectionId);
      } else {
        newSet.add(subsectionId);
      }
      return newSet;
    });
  };

  const handleDeleteSection = (section: { id: number; nombre: string }) => {
    openModal(
      <ConfirmationModal
        open={true}
        onOpenChange={(open: boolean) => !open && close()}
        title="¿Desea eliminar esta sección?"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={async () => {
          try {
            await deleteSectionMutation.mutateAsync({
              id: section.id,
              sectionParent: selectedSectionType!,
            });
            toast.success("Sección eliminada correctamente");
            close();
          } catch (error) {
            toast.error("Error al eliminar la sección");
            console.error(error);
          }
        }}
        onCancel={close}
        isLoading={deleteSectionMutation.isPending}
      >
        <div className="py-2 text-center text-sm text-gray-700">
          {section.nombre}
        </div>
      </ConfirmationModal>
    );
  };

  const handleEditSection = (section: {
    id: number;
    nombre: string;
    seccion_padre?: string;
  }) => {
    setSectionToEdit({
      id: section.id,
      nombre: section.nombre,
      seccion_padre: section.seccion_padre || selectedSectionType!,
    });
    setIsEditSectionModalOpen(true);
  };

  const handleAddSpot = (section: { id: number; nombre: string }) => {
    openModal(<NewSpotModal seccionId={section.id} />);
  };

  if (!selectedSectionType) {
    return (
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Negocios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold mb-6">Categorías</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTION_TYPES.map((sectionType) => (
            <SectionTypeCard
              key={sectionType}
              sectionType={sectionType}
              onClick={() => handleSectionTypeClick(sectionType)}
              isActive={false}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSectionType(null);
                }}
              >
                Negocios
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {selectedSectionType}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Sub-Categorías de{" "}
            {selectedSectionType.charAt(0).toUpperCase() +
              selectedSectionType.slice(1)}
          </h2>
          <button
            onClick={() => setSelectedSectionType(null)}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ← Volver
          </button>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-4">
                <div className="text-left flex-1 flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-6 w-3/4 rounded" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSectionType(null);
                }}
              >
                Negocios
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {selectedSectionType}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Sub-Categorías de{" "}
            {selectedSectionType.charAt(0).toUpperCase() +
              selectedSectionType.slice(1)}
          </h2>
          <button
            onClick={() => setSelectedSectionType(null)}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ← Volver
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error al cargar las Sub-Categorías de{" "}
          {selectedSectionType.charAt(0).toUpperCase() +
            selectedSectionType.slice(1)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedSectionType(null);
              }}
            >
              Negocios
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {selectedSectionType}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Sub-Categorías de{" "}
          {selectedSectionType.charAt(0).toUpperCase() +
            selectedSectionType.slice(1)}
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsNewSectionModalOpen(true)}
            className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2"
            size="sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nueva Sub-Categoría</span>
          </Button>
          <Button
            onClick={() => setSelectedSectionType(null)}
            variant="outline"
            className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2"
            size="sm"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Volver</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {secciones?.map((seccion) => (
          <div key={seccion.id} className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => toggleSubsection(seccion.id)}
                className="text-left flex-1 flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors"
              >
                {openSubsections.has(seccion.id) ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <span>{seccion.nombre}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getSpotCountForSection(seccion.id)}
                  </span>
                  {/*                   <span className="text-sm text-gray-400 font-normal">
                    (ID: {seccion.id})
                  </span> */}
                </h2>
              </button>
              {openSubsections.has(seccion.id) && (
                <div className="flex gap-1">
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleAddSpot(seccion)}
                        className="text-green-500 hover:text-green-700 hover:bg-green-50"
                        aria-label="Agregar Comercio"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      sideOffset={8}
                      className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg z-50"
                    >
                      Agregar Comercio
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditSection(seccion)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        aria-label="Editar Sub-Categoría"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      sideOffset={8}
                      className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg z-50"
                    >
                      Editar Sub-Categoría
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteSection(seccion)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        aria-label="Eliminar Sub-Categoría"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      sideOffset={8}
                      className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg z-50"
                    >
                      Eliminar Sub-Categoría
                    </Tooltip.Content>
                  </Tooltip.Root>
                </div>
              )}
            </div>

            {openSubsections.has(seccion.id) && (
              <div className="border-t border-gray-200 bg-gray-50">
                <SpotsTable
                  seccionPadre={selectedSectionType}
                  seccionId={seccion.id}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {secciones?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No hay secciones disponibles para{" "}
            {selectedSectionType.charAt(0).toUpperCase() +
              selectedSectionType.slice(1)}
          </p>
        </div>
      )}

      <NewSectionModal
        open={isNewSectionModalOpen}
        onOpenChange={setIsNewSectionModalOpen}
        sectionParent={selectedSectionType!}
      />

      <EditSectionModal
        open={isEditSectionModalOpen}
        onOpenChange={setIsEditSectionModalOpen}
        section={sectionToEdit}
      />
    </div>
  );
};

export default Spots;
