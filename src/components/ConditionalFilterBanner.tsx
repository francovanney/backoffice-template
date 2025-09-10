import { useLocation } from "react-router-dom";
import FilterBanner from "./FilterBannerComponent";

interface ConditionalFilterProps {
  search: string;
  setSearch: (search: string) => void;
}

const ConditionalFilter = ({ search, setSearch }: ConditionalFilterProps) => {
  const location = useLocation();
  const shouldBannerFilter = location.pathname === "/banners";

  if (!shouldBannerFilter) {
    return null;
  }

  return (
    <div className="flex-shrink-0 bg-white border-b">
      <FilterBanner search={search} setSearch={setSearch} />
    </div>
  );
};

export default ConditionalFilter;
