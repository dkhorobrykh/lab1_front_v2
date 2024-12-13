import React, {useContext, useState} from 'react';
import {ErrorContext} from "../../context/ErrorContext";
import {AuthContext} from "../../context/AuthContext";
import {findByWheelCountRange} from "../../api/api";
import {Vehicle} from "../../models/Vehicle";
import {Box, Button, TextField} from "@mui/material";
import VehicleTable from "../VehicleTable";

const FindByWheelCountRange = (filters, setFilters) => {
    const [data, setData] = useState(null);
    const {setError, setSuccess} = useContext(ErrorContext);
    const [minNumber, setMinNumber] = useState(null);
    const [maxNumber, setMaxNumber] = useState(null);
    const {user} = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await findByWheelCountRange(minNumber, maxNumber, setError, setSuccess);
        setData(result.map((entity) => Vehicle.fromApiData(entity)));
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        let { name, value } = e.target;

        const intValue = parseInt(value, 10);
        if (!Number.isNaN(intValue)) {
            if (name === 'minNumber') {
                setMinNumber(intValue);
            } else {
                setMaxNumber(intValue);
            }
        }
    }

    return (
        <div>
            <h2><code>Найти все транспортные средства с числом колёс в заданном диапазоне.</code></h2>

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
                        label="Min number of wheels"
                        name="minNumber"
                        value={minNumber}
                        onChange={handleInputChange}
                        required
                        sx={{my: 1.25}}
                        type="number"
                        inputProps={{min: 1, step:"1"}}
                    />
                    <TextField
                        label="Max number of wheels"
                        name="maxNumber"
                        value={maxNumber}
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
                <VehicleTable entities={data} setEntities={setData} user={user} onlyRead={true} filters={filters} setFilters={setFilters}/>
            )}
        </div>
    );
};

export default FindByWheelCountRange;