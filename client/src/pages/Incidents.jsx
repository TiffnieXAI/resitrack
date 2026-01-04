import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import AddIncidents from "../components/AddIncidents";
import IncidentList from "../components/IncidentList";
import "../index.css";

function Incidents() {
 
 

  return (
    <div className="content-wrapper">
      <PageHeader />
      <AddIncidents />
      <IncidentList></IncidentList>
    </div>
  );
}

export default Incidents;
