import React, {useContext, useState} from 'react';
import {ErrorContext} from "../../context/ErrorContext";
import {findByEnginePowerRange} from "../../api/api";
import {Box, Button, TextField} from "@mui/material";
import VehicleTable from "../VehicleTable";
import {AuthContext} from "../../context/AuthContext";
import {Vehicle} from "../../models/Vehicle";

const FindByEnginePowerRange = ({filters, setFilters}) => {

    const [data, setData] = useState(null);
    const {setError, setSuccess} = useContext(ErrorContext);
    const [minRange, setMinRange] = useState(null);
    const [maxRange, setMaxRange] = useState(null);
    const {user} = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await findByEnginePowerRange(minRange, maxRange, setError, setSuccess);
        setData(result.map((entity) => Vehicle.fromApiData(entity)));
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        let { name, value } = e.target;

        const intValue = parseInt(value, 10);
        if (!Number.isNaN(intValue)) {
            if (name === 'minRange') {
                setMinRange(intValue);
            } else {
                setMaxRange(intValue);
            }
        }
    }

    return (
        <div>
            <h2><code>Найти все транспортные средства с мощностью двигателя в заданном диапазоне.</code></h2>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Min engine power"
                        name="minRange"
                        value={minRange}
                        onChange={handleInputChange}
                        required
                        sx={{my: 1.25}}
                        type="number"
                        inputProps={{min: 1, step: "1"}}
                    />
                    <TextField
                        label="Max engine power"
                        name="maxRange"
                        value={maxRange}
                        onChange={handleInputChange}
                        required
                        sx={{my: 1.25}}
                        type="number"
                        inputProps={{min: 1, step: "1"}}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{mt: 2}}
                    >
                        Execute
                    </Button>
                </form>
            </Box>

            {data && (
                <VehicleTable entities={data} setEntities={setData} user={user} onlyRead={true} filters={{}} setFilters={() => {}}/>
            )}
        </div>
    );
};

export default FindByEnginePowerRange;