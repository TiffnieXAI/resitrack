import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import AddIncidents from "../components/AddIncidents";
import "../index.css";

function Incidents() {
 
 

  return (
    <div className="content-wrapper">
      <PageHeader />
      <AddIncidents />
      
    </div>
  );
}

export default Incidents;
