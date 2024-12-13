import React, {useContext, useState} from 'react';
import {ErrorContext} from "../../context/ErrorContext";
import {groupByEnginePower} from "../../api/api";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

const GroupByEnginePower = () => {
    const [data, setData] = useState(null);
    const {setError, setSuccess} = useContext(ErrorContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await groupByEnginePower(setError, setSuccess);
        setData(result);
    }

    return (
        <div>
            <h2><code>Сгруппировать объекты по значению поля enginePower, вернуть количество элементов в каждой группе.</code></h2>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
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
                                <TableCell>Engine Power</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row[0]}>
                                    <TableCell>{row[0]}</TableCell>
                                    <TableCell>{row[1]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default GroupByEnginePower;