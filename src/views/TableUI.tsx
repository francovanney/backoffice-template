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
  TicketIcon,
  EditIcon,
  DeleteIcon,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import Filter from "@/components/filter";
import EventModal from "@/components/event-modal";
import React from "react";

const events = [
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    event: "React Conf 2025",
    category: "Conferencia",
    date: "2025-09-10",
    venue: "Centro de Convenciones",
    address: "Av. Siempre Viva 123, CDMX",
    instagram: "https://instagram.com/reactconf",
    web: "https://reactconf.com",
    ticket: "https://tickets.reactconf.com",
  },
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    event: "JS Meetup",
    category: "Meetup",
    date: "2025-08-22",
    venue: "Coworking Space",
    address: "Calle Falsa 456, GDL",
    instagram: "https://instagram.com/jsmeetup",
    web: "https://jsmeetup.com",
    ticket: "https://tickets.jsmeetup.com",
  },
  {
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    event: "UX Workshop",
    category: "Taller",
    date: "2025-10-05",
    venue: "Hotel Design",
    address: "Blvd. Creativo 789, MTY",
    instagram: "https://instagram.com/uxworkshop",
    web: "https://uxworkshop.com",
    ticket: "https://tickets.uxworkshop.com",
  },
];

const TableUI = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="w-full">
      <Filter onAdd={() => setModalOpen(true)} />
      <EventModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Table>
        <TableCaption>Lista de eventos de ejemplo.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Direccion</TableHead>
            <TableHead className="text-center">Instagram</TableHead>
            <TableHead className="text-center">Web</TableHead>
            <TableHead className="text-center">Ticket</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((ev, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <img
                  src={ev.image}
                  alt={ev.event}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              </TableCell>
              <TableCell className="font-medium">{ev.event}</TableCell>
              <TableCell>{ev.category}</TableCell>
              <TableCell>{ev.date}</TableCell>
              <TableCell>{ev.venue}</TableCell>
              <TableCell>{ev.address}</TableCell>
              <TableCell className="text-center">
                <a
                  href={ev.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="mx-auto text-pink-500 hover:scale-110 transition-transform" />
                </a>
              </TableCell>
              <TableCell className="text-center">
                <a href={ev.web} target="_blank" rel="noopener noreferrer">
                  <WebIcon className="mx-auto text-blue-500 hover:scale-110 transition-transform" />
                </a>
              </TableCell>
              <TableCell className="text-center">
                <a href={ev.ticket} target="_blank" rel="noopener noreferrer">
                  <TicketIcon className="mx-auto text-green-600 hover:scale-110 transition-transform" />
                </a>
              </TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Button size="icon" variant="ghost" aria-label="Editar">
                  <EditIcon className="text-primary" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Eliminar">
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
