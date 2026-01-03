import PageHeader from "../components/PageHeader";
import AddHouseHold from "../components/AddHousehold";
import HouseHoldList from "../components/HouseHoldList";
import AuthGuard from "../components/AuthGuard";

function Households() {
  return (
    
      <div className="content-wrapper">
        <PageHeader />
        <AddHouseHold />
        <HouseHoldList />
      </div>
    
  );
}

export default Households;
