import React, {useCallback, useContext, useEffect, useState} from 'react';
import {approveAdminRequest, declineAdminRequest, getAdminRequests} from "../api/api";
import CircularProgress from "@mui/material/CircularProgress";
import {
    IconButton,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Table
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {ErrorContext} from "../context/ErrorContext";

const AdminRequestsTable = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const {setError, setSuccess} = useContext(ErrorContext);

    const fetchData = useCallback(async () => {
        try {
            const data = await getAdminRequests(setError, setSuccess);
            setRequests(data);
        } catch (error) {
            setError(error.response.data);
        } finally {
            setLoading(false);
        }
    }, [setError, setSuccess, setRequests]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [fetchData]);

    if (loading) return <CircularProgress />;
    if (requests.length === 0) return <p>Sorry, there are no admin requests in the database :(</p>;

    return (
        <>
            <TableContainer component={Paper} style={{marginTop: '2rem'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>User Info</TableCell>
                            <TableCell>Created datetime</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.id}</TableCell>
                                <TableCell>{`${request.user.username} (id [${request.user.id}])`}</TableCell>
                                <TableCell>{request.createdDatetime}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton color="primary" onClick={() => approveAdminRequest(request.id, setError, setSuccess)}>
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => declineAdminRequest(request.id, setError, setSuccess)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default AdminRequestsTable;
