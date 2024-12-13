import React, {useContext} from 'react';
import { Button, Box } from "@mui/material";
import {ErrorContext} from "../context/ErrorContext";

const MakeAdminRequestButton = ({ userId, makeAdminRequest }) => {
    const {setError, setSuccess} = useContext(ErrorContext);

    const handleClick = () => {
        makeAdminRequest(userId, setError, setSuccess);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
                variant="contained"
                color="success"
                onClick={handleClick}
            >
                I want to be an admin!
            </Button>
        </Box>
    );
};

export default MakeAdminRequestButton;
