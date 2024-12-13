import React, {useContext, useState} from 'react';
import {Button, Box, Tooltip} from "@mui/material";
import CreateVehicleForm from "./CreateVehicleForm";
import {ErrorContext} from "../context/ErrorContext";

const AddVehicleButton = ({onVehicleAdded, user}) => {
    const [openCreateForm, setOpenCreateForm] = useState(false);
    const {setError, setSuccess} = useContext(ErrorContext);

    const handleOpenCreateForm = () => setOpenCreateForm(true);
    const handleCloseCreateForm = () => setOpenCreateForm(false);

    const handleSave = () => {
        if (onVehicleAdded) onVehicleAdded();
        handleCloseCreateForm();
    };

    return (
        <Box sx={{textAlign: 'center'}}>
            <Tooltip title={Boolean(user) ? "" : "First, log in!"} style={{margin: 0}} placement="top">
                <div style={{padding: 0}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenCreateForm}
                        sx={{mb: 0}}
                        disabled={!Boolean(user)}
                    >
                        Add Vehicle
                    </Button>
                </div>
            </Tooltip>

            {openCreateForm &&
                <CreateVehicleForm onSave={handleSave} onClose={handleCloseCreateForm} setError={setError}
                                   setSuccess={setSuccess}/>
            }
        </Box>
    );
};

export default AddVehicleButton;
