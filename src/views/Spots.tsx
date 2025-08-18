import { useGetSectionsQuery } from "@/services/useGetSectionsQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Utensils, BedDouble, Martini, Store, TicketCheck } from "lucide-react";

const SECTION_TYPES = ["salir", "comer", "dormir", "actividades", "comercios"];

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

  const {
    data: secciones,
    isLoading,
    error,
  } = useGetSectionsQuery(selectedSectionType || "");

  const handleSectionTypeClick = (sectionType: string) => {
    setSelectedSectionType(sectionType);
  };

  if (!selectedSectionType) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Selecciona una categoría</h1>
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Sub-Secciones de {selectedSectionType}
          </h2>
          <button
            onClick={() => setSelectedSectionType(null)}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ← Volver
          </button>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-3/4 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Sub-Secciones de {selectedSectionType}
          </h2>
          <button
            onClick={() => setSelectedSectionType(null)}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ← Volver
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error al cargar las secciones de {selectedSectionType}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Sub-Secciones de {selectedSectionType}
        </h2>
        <button
          onClick={() => setSelectedSectionType(null)}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ← Volver
        </button>
      </div>

      <div className="space-y-4">
        {secciones?.map((seccion) => (
          <h2
            key={seccion.id}
            className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2"
          >
            {seccion.nombre}
          </h2>
        ))}
      </div>

      {secciones?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No hay secciones disponibles para {selectedSectionType}
          </p>
        </div>
      )}
    </div>
  );
};

export default Spots;
