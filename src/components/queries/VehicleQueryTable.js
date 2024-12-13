import React from 'react';
import GroupByEnginePower from "./GroupByEnginePower";
import CountByFuelConsumption from "./CountByFuelConsumption";
import CountByFuelTypeLessThan from "./CountByFuelTypeLessThan";
import FindByEnginePowerRange from "./FindByEnginePowerRange";
import FindByWheelCountRange from "./FindByWheelCountRange";

const VehicleQueryTable = ({filters, setFilters}) => {
    return (
        <div>
            <h1>Queries</h1>

            <GroupByEnginePower />
            <CountByFuelConsumption />
            <CountByFuelTypeLessThan />
            <FindByEnginePowerRange filters={filters} setFilters={setFilters}/>
            <FindByWheelCountRange filters={filters} setFilters={setFilters}/>
        </div>
    );
};

export default VehicleQueryTable;