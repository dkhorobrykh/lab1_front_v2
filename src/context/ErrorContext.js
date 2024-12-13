import React, {createContext, useState} from 'react';
import {Alert, Snackbar} from "@mui/material";

export const ErrorContext = createContext();

export const ErrorProvider = ({children}) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleCloseError = () => {
        setError(null);
    }

    const handleCloseSuccess = () => {
        setSuccess(null);
    }

    return (
        <ErrorContext.Provider value={{setError, setSuccess}}>
            {children}

            {error && (
                <Snackbar
                    open={Boolean(error)}
                    autoHideDuration={6000}
                    onClose={handleCloseError}
                    anchorOrigin={{vertical: "top", horizontal: "right"}}
                >
                    <Alert onClose={handleCloseError} severity="error">
                        {error.message}
                    </Alert>
                </Snackbar>
            )}

            {success && (
                <Snackbar
                    open={Boolean(success)}
                    autoHideDuration={6000}
                    onClose={handleCloseSuccess}
                    anchorOrigin={{vertical: "top", horizontal: "right"}}
                >
                    <Alert onClose={handleCloseSuccess} severity="success">
                        {success.message}
                    </Alert>
                </Snackbar>
            )}
        </ErrorContext.Provider>
    );
};