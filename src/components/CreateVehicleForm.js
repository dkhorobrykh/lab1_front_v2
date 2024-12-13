import React, {useEffect, useState} from 'react';
import {addVehicle, updateEntity} from "../api/api";
import {Box, Button, MenuItem, Modal, TextField, Checkbox, FormControlLabel} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',  // исправлено на корректное значение
    boxShadow: 24,
    p: 4,
};

const fieldSt = {
    my: 1.25,  // используем `my` (margin-y) для вертикальных отступов
};

const CreateVehicleForm = ({vehicle, onClose, onSave, setError, setSuccess}) => {
    const [vehicleData, setVehicleData] = useState({
        name: "",
        coordinates: {x: '', y: ''},
        type: "",
        enginePower: "",
        numberOfWheels: "",
        capacity: "",
        distanceTravelled: "",
        fuelConsumption: "",
        fuelType: "",
        canBeEditedByAdmin: true
    });

    useEffect(() => {
        if (vehicle) {
            setVehicleData(vehicle);
        }
    }, [vehicle]);



    const handleInputChange = (e) => {
        const {name, value} = e.target;

        const integerFields = ["enginePower", "numberOfWheels", "distanceTravelled"];

        if (integerFields.includes(name)) {
            const intValue = parseInt(value, 10);
            if (!Number.isNaN(intValue)) {
                setVehicleData(prevState => ({
                    ...prevState,
                    [name]: intValue
                }));
            }
        } else if (name === 'coordinates.x') {
            const intValue = parseInt(value, 10);
            if (!Number.isNaN(intValue)) {
                setVehicleData(prevState => ({
                    ...prevState,
                    coordinates: {
                        ...prevState.coordinates,
                        x: intValue
                    }
                }));
            }
        } else if (name.startsWith("coordinates.y")) {
            const floatValue = parseFloat(value);
            if (!Number.isNaN(floatValue)) {
                setVehicleData(prevState => ({
                    ...prevState,
                    coordinates: {
                        ...prevState.coordinates,
                        y: floatValue
                    }
                }));
            }
        } else if (name === 'capacity') {
            const floatValue = parseFloat(value);
            if (!Number.isNaN(floatValue)) {
                setVehicleData(prevState => ({
                    ...prevState,
                    [name]: floatValue
                }));
            }
        } else if (name === 'fuelConsumption') {
            const floatValue = parseFloat(value);
            if (!Number.isNaN(floatValue)) {
                setVehicleData(prevState => ({
                    ...prevState,
                    [name]: floatValue
                }));
            }
        } else {
            setVehicleData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (vehicle) {
            await updateEntity(vehicle.id, vehicleData, setError, setSuccess);
        } else {
            await addVehicle(vehicleData, setError, setSuccess);
        }
        if (onSave) onSave();
        onClose();
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={style}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={vehicleData.name}
                        onChange={handleInputChange}
                        fullWidth
                        sx={fieldSt}
                        required
                        inputProps={{ minLength: 1}}
                    />
                    <TextField
                        label="Coordinate X"
                        name="coordinates.x"
                        value={vehicleData.coordinates.x}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={fieldSt}
                        type="number"
                        inputProps={{step:"1"}}
                    />
                    <TextField
                        label="Coordinate Y"
                        name="coordinates.y"
                        value={vehicleData.coordinates.y}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={fieldSt}
                        type="number"
                        inputProps={{step: "0.0000001"}}
                    />
                    <TextField
                        label="Engine Power"
                        name="enginePower"
                        value={vehicleData.enginePower}
                        onChange={handleInputChange}
                        fullWidth
                        sx={fieldSt}
                        type="number"
                        inputProps={{min:1, step:"0.0000001"}}
                    />
                    <TextField
                        label="Number of Wheels"
                        name="numberOfWheels"
                        value={vehicleData.numberOfWheels}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={fieldSt}
                        type="number"
                        inputProps={{min:1, step:"1"}}
                    />
                    <TextField
                        label="Capacity"
                        name="capacity"
                        value={vehicleData.capacity}
                        onChange={handleInputChange}
                        fullWidth
                        sx={fieldSt}
                        type="number"
                        required
                        inputProps={{min: 0.01, step: "0.0000001"}}
                    />
                    <TextField
                        label="Distance Travelled"
                        name="distanceTravelled"
                        value={vehicleData.distanceTravelled}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={fieldSt}
                        type="number"
                        inputProps={{min:1}}
                    />
                    <TextField
                        label="Fuel Consumption"
                        name="fuelConsumption"
                        value={vehicleData.fuelConsumption}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={fieldSt}
                        type="number"
                        inputProps={{min:0.01, step: "0.0000001"}}
                    />
                    <TextField
                        select
                        label="Fuel Type"
                        name="fuelType"
                        value={vehicleData.fuelType}
                        onChange={handleInputChange}
                        fullWidth
                        sx={fieldSt}
                    >
                        <MenuItem value="GASOLINE">Gasoline</MenuItem>
                        <MenuItem value="ELECTRICITY">Electricity</MenuItem>
                        <MenuItem value="MANPOWER">Manpower</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Vehicle Type"
                        name="type"
                        value={vehicleData.type}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={fieldSt}
                    >
                        <MenuItem value="SHIP">Ship</MenuItem>
                        <MenuItem value="MOTORCYCLE">Motorcycle</MenuItem>
                        <MenuItem value="HOVERBOARD">Hoverboard</MenuItem>
                    </TextField>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={vehicleData.canBeEditedByAdmin}
                                onChange={() => {
                                    setVehicleData(prev => ({
                                        ...prev,
                                        canBeEditedByAdmin: !prev.canBeEditedByAdmin
                                    }));
                                }}
                            />
                        }
                        label="Admin can edit or delete this vehicle"
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={fieldSt}>
                        {vehicle ? "Update Vehicle" : "Create Vehicle"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateVehicleForm;
