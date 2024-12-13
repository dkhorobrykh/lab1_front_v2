import React from 'react';
import { importVehicles } from "../api/api";
import { Box, Button, CircularProgress, Typography, Tooltip } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const ImportVehiclesButton = ({ setError, setSuccess }) => {
    const [file, setFile] = React.useState(null);
    const [filename, setFilename] = React.useState("No file selected...");
    const [loading, setLoading] = React.useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFilename(selectedFile.name);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) return alert("Please select a file!");

        setLoading(true); // Включаем анимацию
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', filename);

        try {
            await importVehicles(formData, setError, setSuccess);
            setFile(null);
            setFilename("No file selected...");
        } catch (error) {
            setError(error.response?.data || "An error occurred during the import.");
        } finally {
            setLoading(false); // Отключаем анимацию
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "center",
                paddingTop: "10px"
            }}
        >
            <Typography
                variant="body1"
                color={file ? "textPrimary" : "textSecondary"}
                sx={{ minWidth: "200px", textAlign: "center" }}
            >
                {filename}
            </Typography>

            <Tooltip title="Only .csv and .json files are allowed" placement="top">
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                    }}
                    disabled={loading} // Блокируем кнопку во время загрузки
                >
                    Upload File
                    <input
                        type="file"
                        accept=".csv,.json"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
            </Tooltip>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                }}
                onClick={handleSubmit}
                disabled={loading} // Блокируем кнопку отправки во время загрузки
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
        </Box>
    );
};

export default ImportVehiclesButton;
