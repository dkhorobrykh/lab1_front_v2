import React, {useContext, useState} from 'react';
import {ErrorContext} from "../../context/ErrorContext";
import {countByFuelTypeLessThan} from "../../api/api";
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

const CountByFuelTypeLessThan = () => {
    const [data, setData] = useState(null);
    const {setError, setSuccess} = useContext(ErrorContext);
    const [fuelType, setFuelType] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await countByFuelTypeLessThan(fuelType, setError, setSuccess);
        setData(result);
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setFuelType(e.target.value);
    }

    return (
        <div>
            <h2><code>Вернуть количество объектов, значение поля fuelType которых меньше заданного.</code></h2>

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
                        label="Fuel Type"
                        name="fuelConsumption"
                        value={fuelType}
                        onChange={handleInputChange}
                        required
                        sx={{my: 1.25}}
                        type="text"
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

export default CountByFuelTypeLessThan;