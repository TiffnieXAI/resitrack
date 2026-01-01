
import PageHeader from "../components/PageHeader";
import AddHouseHold from "../components/AddHousehold";
import HouseHoldList from "../components/HouseHoldList";
function Households() {
 
 

  return (
    <div className="content-wrapper ">
      <PageHeader />
      <AddHouseHold/>
      <HouseHoldList/>
    </div>
  );
}

export default Households;
