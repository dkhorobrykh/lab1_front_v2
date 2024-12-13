import './App.css';
import VehicleTable from "./components/VehicleTable";
import {useCallback, useContext, useEffect, useState} from "react";
import {getEntities} from "./api/api";
import {AuthContext} from "./context/AuthContext";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Header from "./components/Header";
import VehicleMap from "./components/VehicleMap";
import AdminRequestsTable from "./components/AdminRequestsTable";
import {ErrorContext} from "./context/ErrorContext";
import {setupInterceptors} from "./api/UseAxiosErrorInterceptor";
import VehicleQueryTable from "./components/queries/VehicleQueryTable";
import AuditDataTable from "./components/AuditDataTable";
import VehicleImportTable from "./components/VehicleImportTable";

function App() {
    const {setError, setSuccess} = useContext(ErrorContext);

    useEffect(() => {
        setupInterceptors(setError);
    }, [setError]);

    const [vehicles, setVehicles] = useState([]);
    const [activeComponent, setActiveComponent] = useState("vehicleTable");
    const {user, logout} = useContext(AuthContext);
    const [filters, setFilters] = useState({
        name: "",
        fuelType: "",
        vehicleType: "",
        sortBy: "id",
        ascending: true,
        page: 0,
        size: 10,
    });

    const [defaultFilters] = useState({
        name: "",
        fuelType: "",
        vehicleType: "",
        sortBy: "id",
        ascending: true,
        page: 0,
        size: 10,
    })

    const fetchVehicles = useCallback(async () => {
        const data = await getEntities(filters, setFilters, setError, () => {
        });
        setVehicles(data);
    }, [filters, setError]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchVehicles();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [fetchVehicles]);

    useEffect(() => {
        setFilters(defaultFilters);
    }, [activeComponent, defaultFilters]);

    const handleVehicleAdded = () => {
        fetchVehicles();
    };

    return (
        <div className="App">
            <Header
                onLoginOpen={() => setActiveComponent("loginPage")}
                onRegisterOpen={() => setActiveComponent("registerPage")}
                setActiveComponent={setActiveComponent}
                user={user}
                logout={logout}
            />

            <div className="activeElement" style={{
                paddingTop: 0,
                paddingRight: '3rem',
                paddingLeft: '3rem',
                paddingBottom: '1.5rem'
            }}>
                {activeComponent === "loginPage" && <LoginPage setActiveComponent={setActiveComponent}/>}

                {activeComponent === "registerPage" && <RegisterPage setActiveComponent={setActiveComponent}/>}

                {activeComponent === "vehicleTable" && (
                    <>
                        <h1>Vehicle List</h1>
                        <VehicleTable entities={vehicles} setEntities={setVehicles} user={user} filters={filters}
                                      setFilters={setFilters} onlyRead={false} onVehicleAdded={handleVehicleAdded}/>
                    </>
                )}

                {activeComponent === "vehicleMap" && (
                    <>
                        <h1>Vehicle Map</h1>
                        <VehicleMap vehicles={vehicles} setVehicles={setVehicles} setFilters={setFilters} filters={filters}/>
                    </>
                )}

                {activeComponent === "vehicleQueries" && <VehicleQueryTable filters={filters} setFilters={setFilters}/>}

                {activeComponent === "vehicleImport" && user && <VehicleImportTable setError={setError} setSuccess={setSuccess} />}

                {activeComponent === "adminRequests" && user && user.admin && <AdminRequestsTable/>}

                {activeComponent === "auditData" && user && user.admin && <AuditDataTable/>}
            </div>
        </div>
    );
}

export default App;
