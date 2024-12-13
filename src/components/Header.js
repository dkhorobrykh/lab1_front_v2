import {useState} from "react";
import {AppBar, Button, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import LogoutIcon from '@mui/icons-material/Logout';
import MakeAdminRequestButton from "./MakeAdminRequestButton";
import {makeAdminRequest} from "../api/api";

const Header = ({onLoginOpen, onRegisterOpen, user, logout, setActiveComponent}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleAdminRequestsClick = () => {
        setActiveComponent("adminRequests");
        handleMenuClose();
    };

    const handleVehicleTableClick = () => {
        setActiveComponent("vehicleTable");
        handleMenuClose();
    }

    const handleVehicleMapClick = () => {
        setActiveComponent("vehicleMap");
        handleMenuClose();
    }

    const handleVehicleQueriesClick = () => {
        setActiveComponent("vehicleQueries");
        handleMenuClose();
    }

    const handleVehicleImportClick = () => {
        setActiveComponent("vehicleImport");
        handleMenuClose();
    }

    const handleAuditDataClick = () => {
        setActiveComponent("auditData");
        handleMenuClose();
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" onClick={handleMenuOpen}><MenuOpenIcon/></Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleVehicleTableClick}>Vehicles table</MenuItem>
                        <MenuItem onClick={handleVehicleMapClick}>Vehicles map</MenuItem>
                        <MenuItem onClick={handleVehicleQueriesClick}>Vehicle queries</MenuItem>
                        { user && (
                            <MenuItem onClick={handleVehicleImportClick}>Import vehicles</MenuItem>
                        )}
                        {user && user.admin && (
                            <MenuItem onClick={handleAdminRequestsClick}>Admin requests table</MenuItem>
                        )}
                        {user && user.admin && (
                            <MenuItem onClick={handleAuditDataClick}>Audit Data</MenuItem>
                        )}
                    </Menu>

                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        IS   |   Lab #2   |   Khorobrykh Daniil, P3316
                    </Typography>

                    {user ? (
                        <>
                            <Typography variant="body1" sx={{mr: 2}}>
                                Hello, {user.username}!
                            </Typography>
                            <Button color="inherit" onClick={logout}><LogoutIcon/></Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" onClick={onLoginOpen}>Login</Button>
                            <Button color="inherit" onClick={onRegisterOpen}>Register</Button>
                        </>
                    )}

                    {user && !user.admin && (
                        <MakeAdminRequestButton userId={user.id} makeAdminRequest={makeAdminRequest}/>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Header;
