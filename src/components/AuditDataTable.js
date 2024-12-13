import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ErrorContext} from "../context/ErrorContext";
import api from "../api/UseAxiosErrorInterceptor";
import {approveAdminRequest, declineAdminRequest, getAdminRequests, getAuditData} from "../api/api";
import {Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const AuditDataTable = () => {
    const {setError, setSuccess} = useContext(ErrorContext);

    const [auditData, setAuditData] = useState([]);

    const fetchData = useCallback(async (needToLog) => {
        try {
            const data = await getAuditData(setError, needToLog ? setSuccess : () => {});
            setAuditData(data);
        } catch (error) {
            setError(error.response.data);
        }
    }, [setError, setSuccess, setAuditData]);

    useEffect(() => {
        fetchData(true);
    }, [fetchData]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData(false);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [fetchData]);

    if (auditData.length === 0) return <p>Sorry, there are no audit data in the database :(</p>;

    return (
        <div>
            <TableContainer component={Paper} style={{marginTop: '2rem'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>Table name</TableCell>
                            <TableCell>Operation</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Old Value</TableCell>
                            <TableCell>New Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {auditData.map((data) => (
                            <TableRow key={data.id}>
                                <TableCell>{data.id}</TableCell>
                                <TableCell>{data.tableName}</TableCell>
                                <TableCell>{data.operation}</TableCell>
                                <TableCell>{data.timestamp}</TableCell>
                                <TableCell>{data.user ? `${data.user.username} (id [${data.user.id}])` : ""}</TableCell>
                                <TableCell>
                                    <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                                        {JSON.stringify(JSON.parse(data.oldValue), null, 2)}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                                        {JSON.stringify(JSON.parse(data.newValue), null, 2)}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AuditDataTable;