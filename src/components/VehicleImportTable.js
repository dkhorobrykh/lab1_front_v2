import React, {useCallback, useEffect, useState} from 'react';
import ImportVehiclesButton from "./ImportVehiclesButton";
import {
    Button,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip
} from "@mui/material";
import {getImportHistory} from "../api/api";
import {GetApp, ThumbDownAlt, ThumbUpAlt, Visibility} from "@mui/icons-material";
import {BASE_API_URL} from "../config/config";

const VehicleImportTable = ({setError, setSuccess}) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogInfo, setDialogInfo] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const data = await getImportHistory(setError, () => {});
            setHistory(data);
        } catch (error) {
            setError(error.response.data);
        } finally {
            setLoading(false);
        }
    }, [setError, setHistory]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [fetchData]);

    const openDialog = (fileInfo) => {
        setDialogInfo(fileInfo);
    };

    const closeDialog = () => {
        setDialogInfo(null);
    };

    const downloadFile = (filename) => {
        const link = document.createElement("a");
        link.href = `${BASE_API_URL}/import/download/${filename}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (loading) return <CircularProgress />;

    return (
        <div>
            <ImportVehiclesButton setError={setError} setSuccess={setSuccess} />

            {history.length === 0 && (<p>Sorry, there is no import history in the database :(</p>)}

            {history.length > 0 && (
                <>
                    <TableContainer component={Paper} style={{marginTop: '2rem'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell>User Info</TableCell>
                                    <TableCell>Created datetime</TableCell>
                                    <TableCell>File Content</TableCell>
                                    <TableCell>Success?</TableCell>
                                    <TableCell>Success objects</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((importHistory) => (
                                    <TableRow key={importHistory.id}>
                                        <TableCell>{importHistory.id}</TableCell>
                                        <TableCell>{`id [${importHistory.user.id}]`}</TableCell>
                                        <TableCell>{importHistory.creationDatetime}</TableCell>
                                        <TableCell>
                                            {/*{importHistory.fileInfo.length > 175 && (*/}
                                            <Tooltip title="View full content">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openDialog(importHistory.fileInfo)}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download file">
                                                <IconButton
                                                size="small"
                                                onClick={() => downloadFile(importHistory.filename)}
                                                disabled={importHistory.filename === null}>
                                                    <GetApp />
                                                </IconButton>
                                            </Tooltip>
                                            {/*)}*/}
                                            {/*{importHistory.fileInfo.slice(0, 175)}/!* Показываем часть текста *!/*/}
                                        </TableCell>
                                        <TableCell>
                                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                                {importHistory.success ? (
                                                    <ThumbUpAlt/>
                                                ) : (
                                                    <ThumbDownAlt/>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{importHistory.successObjects}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog open={!!dialogInfo} onClose={closeDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>File Content</DialogTitle>
                        <DialogContent>
                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                        {dialogInfo}
                    </pre>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default VehicleImportTable;
