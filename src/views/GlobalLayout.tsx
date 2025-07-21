import LeftMenu from "./LeftMenu";
import TableUI from "./TableUI";

const GlobalLayout = () => {
  return (
    <div className="w-full h-full flex pt-20">
      <div className="w-[15vw] max-w-[15vw] min-w-0 h-full sticky top-0 left-0">
        <LeftMenu />
      </div>
      <div className="w-[85vw] max-w-[85vw] min-w-0 h-full overflow-y-auto">
        <TableUI />
      </div>
    </div>
  );
};

export default GlobalLayout;
