import TableUI from "./TableUI";

interface GlobalLayoutProps {
  search: string;
}

const GlobalLayout = ({ search }: GlobalLayoutProps) => {
  return (
    <div className="h-full w-full">
      <TableUI search={search} />
    </div>
  );
};

export default GlobalLayout;
