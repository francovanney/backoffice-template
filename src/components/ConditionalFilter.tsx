import { useLocation } from "react-router-dom";
import Filter from "./Filter";

interface ConditionalFilterProps {
  search: string;
  setSearch: (search: string) => void;
}

const ConditionalFilter = ({ search, setSearch }: ConditionalFilterProps) => {
  const location = useLocation();
  const shouldShowFilter = location.pathname === "/events";

  if (!shouldShowFilter) {
    return null;
  }

  return (
    <div className="flex-shrink-0 bg-white border-b">
      <Filter search={search} setSearch={setSearch} />
    </div>
  );
};

export default ConditionalFilter;
