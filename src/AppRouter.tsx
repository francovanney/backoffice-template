import { Routes, Route, Navigate } from "react-router-dom";
import EventsTable from "./views/EventsTable";
import Spots from "./views/Spots";
import Config from "./views/Config";
import BannersTable from "./views/BannersTable";

interface AppRouterProps {
  search: string;
}

const AppRouter = ({ search }: AppRouterProps) => {
  return (
    <Routes>
      <Route path="/events" element={<EventsTable search={search} />} />
      <Route path="/negocios" element={<Spots />} />
      <Route path="/banners" element={<BannersTable search={search} />} />
      <Route path="/config" element={<Config />} />
      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  );
};

export default AppRouter;
