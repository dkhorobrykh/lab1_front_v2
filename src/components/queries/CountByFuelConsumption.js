import React, {useContext, useState} from 'react';
import {ErrorContext} from "../../context/ErrorContext";
import {countByFuelConsumption} from "../../api/api";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";

const CountByFuelConsumption = () => {
    const [data, setData] = useState(null);
    const {setError, setSuccess} = useContext(ErrorContext);
    const [fuelConsumption, setFuelConsumption] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await countByFuelConsumption(fuelConsumption, setError, setSuccess);
        setData(result);
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setFuelConsumption(e.target.value);
    }

    return (
        <div>
            <h2><code>Вернуть количество объектов, значение поля fuelConsumption которых равно заданному.</code></h2>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Fuel Consumption"
                        name="fuelConsumption"
                        value={fuelConsumption}
                        onChange={handleInputChange}
                        required
                        sx={{my: 1.25}}
                        type="number"
                        inputProps={{min: 0.01, step: "0.0000001"}}
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Answer</TableCell>
                                <TableCell>{data.value}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody />
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default CountByFuelConsumption;