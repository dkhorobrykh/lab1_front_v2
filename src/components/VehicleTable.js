import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    deleteEntity,
    getEntities,
    updateEntity,
} from "../api/api";
import {
    Button,
    CircularProgress, FormControl,
    IconButton, InputLabel, MenuItem,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {Vehicle} from "../models/Vehicle";
import CreateVehicleForm from "./CreateVehicleForm";
import {ErrorContext} from "../context/ErrorContext";
import {ThumbDownAlt, ThumbUpAlt} from "@mui/icons-material";
import AddVehicleButton from "./AddVehicleButton";

const VehicleTable = ({entities, setEntities, user, onlyRead, filters, setFilters, onVehicleAdded}) => {
    const [loading, setLoading] = useState(true);
    const {setError, setSuccess} = useContext(ErrorContext);
    const [editingCell, setEditingCell] = useState({rowId: null, field: null});
    const [editValue, setEditValue] = useState("");
    const [openEditForm, setOpenEditForm] = useState(false);
    const [currentEntity, setCurrentEntity] = useState(null);

    const fetchData = useCallback(async () => {
        if (onlyRead) {
            setLoading(false);
            return;
        }

        try {
            const data = await getEntities(filters, setFilters, setError, () => {
            });
            setEntities(data);
        } catch (err) {
            setError(err.response.data);
        } finally {
            setLoading(false);
        }
    }, [filters, setFilters, onlyRead, setError, setEntities]);

    useEffect(() => {
        if (onlyRead) {
            setLoading(false);
            return;
        }

        fetchData();
    }, [onlyRead, fetchData]);

    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters((prev) => ({...prev, [name]: value}));
    }

    const handleSortChange = (e) => {
        setFilters((prev) => ({...prev, sortBy: e.target.value}));
    }

    const handlePaginationChange = (direction) => {
        setFilters((prev) => ({...prev, page: prev.page + direction}));
    }

    const canEditOrDelete = (vehicle) => {
        return (user && user.id === vehicle.user.id)
            || (user && user.admin === true && vehicle.canBeEditedByAdmin === true);
    };

    const handleOpenEditForm = (entity) => {
        setCurrentEntity(entity);
        setOpenEditForm(true);
    };

    const handleCloseEditForm = () => {
        setOpenEditForm(false);
        setCurrentEntity(null);
    };

    const handleDelete = async (vehicleId) => {
        try {
            await deleteEntity(vehicleId, setError, setSuccess);
            setEntities((prev) => prev.filter((entity) => entity.id !== vehicleId));
            fetchData();
        } catch (error) {
            setError(error.response.data);
            console.error("Error deleting entity: ", error);
        }
    };

    const handleDoubleClick = (rowId, field, currentValue, vehicle) => {
        if (canEditOrDelete(vehicle)) {
            setEditingCell({rowId, field});
            setEditValue(currentValue);
        }
    };

    const handleChange = (e) => setEditValue(e.target.value);

    const handleSave = async () => {
        const {rowId, field} = editingCell;

        try {
            const updatedEntity = {...entities.find((entity) => entity.id === rowId)};

            if (field === "coordinateX" || field === "coordinateY") {
                updatedEntity.coordinates[field === "coordinateX" ? "x" : "y"] = parseFloat(editValue);
            } else {
                updatedEntity[field] = editValue;
            }

            await updateEntity(rowId, updatedEntity, setError, setSuccess);
            resetEditing();
        } catch (err) {
            console.error(err);
            setError(err.response.data);
            console.error("Error updating entity: ", err);
        }
    };

    const resetEditing = () => {
        setEditingCell({rowId: null, field: null});
        setEditValue("");
    };

    const handleCancel = () => resetEditing();

    const columns = Vehicle.getFields();

    if (loading) return <CircularProgress/>;

    return (
        <>
            {!onlyRead ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <div style={{marginBottom: '0.75rem'}}>
                        <TextField
                            label="Name"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            variant="outlined"
                            size="small"
                            style={{marginRight: "1rem", minWidth: '10rem'}}
                        />

                        <FormControl variant="outlined" size="small" style={{marginRight: "1rem", minWidth: '10rem'}}>
                            <InputLabel>Fuel Type</InputLabel>
                            <Select
                                label="Fuel Type"
                                name="fuelType"
                                value={filters.fuelType}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="GASOLINE">Gasoline</MenuItem>
                                <MenuItem value="ELECTRICITY">Electricity</MenuItem>
                                <MenuItem value="HYBRID">Hybrid</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" size="small" style={{marginRight: "1rem", minWidth: "10rem"}}>
                            <InputLabel>Vehicle Type</InputLabel>
                            <Select
                                label="Vehicle Type"
                                name="vehicleType"
                                value={filters.vehicleType}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="SHIP">Ship</MenuItem>
                                <MenuItem value="MOTORCYCLE">Motorcycle</MenuItem>
                                <MenuItem value="HOVERBOARD">Hoverboard</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" size="small" style={{marginRight: "1rem", minWidth: '10rem'}}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                label="Sort By"
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleSortChange}
                            >
                                <MenuItem value="id">ID</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="fuelType">Fuel Type</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={() => setFilters((prev) => ({...prev, ascending: !prev.ascending}))}
                        >
                            {filters.ascending ? "Sort Descending" : "Sort Ascending"}
                        </Button>
                    </div>

                    <AddVehicleButton onVehicleAdded={onVehicleAdded} user={user}/>
                </div>
            ) : (<></>)}

            {entities?.length === 0 ? () => {
                if (filters['page'] > 0) {
                    handlePaginationChange(-1);
                } else {
                    return (
                        <p>
                            Sorry, there are no vehicles in the database :( <br/>
                            Add your first vehicle now with <b><code>ADD VEHICLE</code></b> button!
                        </p>
                    );
                }
            } : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column}>{column}</TableCell>
                                    ))}
                                    <TableCell>Can be edited by admin?</TableCell>
                                    {!onlyRead ? <TableCell>Actions</TableCell> : <></>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entities.map((entity) => (
                                    <TableRow key={entity.id}>
                                        {columns.map((column) => {
                                            const cellValue =
                                                column === "coordinateX"
                                                    ? entity.coordinates.x
                                                    : column === "coordinateY"
                                                        ? entity.coordinates.y
                                                        : entity[column];

                                            const isEditing = editingCell.rowId === entity.id && editingCell.field === column;
                                            const isEditable = canEditOrDelete(entity);

                                            return (
                                                <TableCell
                                                    key={column}
                                                    onDoubleClick={() => handleDoubleClick(entity.id, column, cellValue, entity)}
                                                    style={{
                                                        cursor: isEditable ? "pointer" : "not-allowed",
                                                        backgroundColor: isEditing ? "#f0f0f0" : "inherit",
                                                        color: isEditable ? "inherit" : "#999",
                                                    }}
                                                >
                                                    {isEditing ? (
                                                        <div style={{display: "flex", alignItems: "center"}}>
                                                            <TextField
                                                                value={editValue}
                                                                onChange={handleChange}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                            <IconButton color="primary" onClick={handleSave}>
                                                                <CheckIcon/>
                                                            </IconButton>
                                                            <IconButton color="secondary"
                                                                        onClick={handleCancel}>
                                                                <CloseIcon/>
                                                            </IconButton>
                                                        </div>
                                                    ) : (
                                                        cellValue
                                                    )}
                                                </TableCell>
                                            );
                                        })}

                                        <TableCell>
                                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                                {entity.canBeEditedByAdmin ? (
                                                    <ThumbUpAlt/>
                                                ) : (
                                                    <ThumbDownAlt/>
                                                )}
                                            </div>
                                        </TableCell>

                                        {canEditOrDelete(entity) && !onlyRead ? (
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => handleOpenEditForm(entity)}
                                                    disabled={!canEditOrDelete(entity)}
                                                    style={{color: canEditOrDelete(entity) ? "inherit" : "#999"}}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDelete(entity.id)}
                                                    disabled={!canEditOrDelete(entity)}
                                                    style={{color: canEditOrDelete(entity) ? "inherit" : "#999"}}
                                                >
                                                    <DeleteIcon color="error"/>
                                                </IconButton>
                                            </TableCell>
                                        ) : (<TableCell></TableCell>)}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {
                openEditForm && (
                    <CreateVehicleForm
                        vehicle={currentEntity}
                        onClose={handleCloseEditForm}
                        onSave={fetchData}
                        setError={setError}
                        setSuccess={setSuccess}
                    />
                )
            }

            {!onlyRead && (
                <div style={{
                    marginTop: "1rem",
                    display: "flex",
                    justifyContent: "right",
                    marginRight: "1rem",
                    marginLeft: "1rem"
                }}>
                    <Button
                        variant="contained"
                        onClick={() => handlePaginationChange(-1)}
                        disabled={filters.page === 0}
                        style={{margin: 1, marginRight: 2}}
                    >
                        <ArrowBackIosNewIcon/>
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handlePaginationChange(1)}
                        style={{margin: 1, marginLeft: 2}}
                    >
                        <ArrowForwardIosIcon/>
                    </Button>
                </div>
            )}
        </>
    )
        ;
};

export default VehicleTable;
