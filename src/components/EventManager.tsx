import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import NewEventModal from "@/components/NewEventModal";
import { Event } from "@/types/event";

export default function EventManager() {
  const { openModal } = useModal();

  // Example event data matching the provided JSON
  const exampleEvent: Event = {
    show_id: 76,
    title: "Entrecopas y Astros",
    venue: "Placida",
    event_date: "2025-07-25T03:00:00.000Z",
    city: "",
    url: "",
    end_date: null,
    start_date: null,
    completedevent: null,
    categories: ["Evento", "Gastronomía"],
    instagram: "winevinotecab",
    web: "",
    address: "Camino ala laguna",
    image_url: "http://api.pampacode.com/uploads/flyer-1752632203182.jpg",
    is_featured: false,
    youtube: null,
    description: null,
  };

  const handleAddEvent = () => {
    openModal(<NewEventModal />);
  };

  const handleEditEvent = () => {
    openModal(<NewEventModal event={exampleEvent} />);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gestión de Eventos</h1>
      <div className="flex gap-4">
        <Button onClick={handleAddEvent}>Agregar evento</Button>
        <Button onClick={handleEditEvent} variant="outline">
          Editar evento de ejemplo
        </Button>
      </div>
    </div>
  );
}
