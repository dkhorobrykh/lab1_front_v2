import api from './UseAxiosErrorInterceptor';
import {BASE_API_URL} from "../config/config";
import {Vehicle} from "../models/Vehicle";

export const getImportHistory = async (setError, setSuccess) => {
    try {
        const response = await api.get(BASE_API_URL + "/import");
        setSuccess({message: "Import history successfully received"});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error("Error fetching import history data", error);
    }
}

export const importVehicles = async (formData, setError, setSuccess) => {
    try {
        await api.post(BASE_API_URL + "/import", formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
        setSuccess({message: "Successfully imported!"});
    } catch (error) {
        setError(error.response.data);
        console.error("Error importing vehicle data", error);
    }
}

export const getAuditData = async (setError, setSuccess) => {
    try {
        const response = await api.get(`${BASE_API_URL}/audit`);
        setSuccess({message: "Audit Data was successfully received."});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error("Error fetching audit data:", error);
    }
}

export const getEntities = async (filters, setFilters, setError, setSuccess) => {
    try {
        let {name, fuelType, vehicleType, sortBy, ascending, page, size} = filters;

        let response = await api.get(`${BASE_API_URL}/vehicle`, {
            params: {
                name,
                fuelType,
                vehicleType,
                sortBy,
                ascending,
                page,
                size
            }
        })

        if (response.data.length === 0 && filters.page > 0) {
            setFilters(prev => ({
                ...prev,
                page: prev.page -= 1
            }));

            response = await getEntities(filters, setFilters, setError, setSuccess);
        }

        setSuccess({message: "Vehicles was successfully updated."});

        return response.data.map(entity => Vehicle.fromApiData(entity));
    } catch (error) {
        setError(error.response.data);
        console.error("Error fetching entities: ", error);
    }
}

export const updateEntity = async (id, updatedEntity, setError, setSuccess) => {
    try {
        const response = await api.put(`${BASE_API_URL}/vehicle/${id}`, updatedEntity);
        setSuccess({message: `Vehicle with id [${id}] was successfully updated.`});
        return response.data;
    } catch (error) {
        console.error('Error updating entity:', error);
        setError(error.response.data);
    }
}

export const addVehicle = async (addedEntity, setError, setSuccess) => {
    try {
        const response = await api.post(`${BASE_API_URL}/vehicle/add`, {...addedEntity});
        setSuccess({message: "Vehicle was successfully added."})
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error('Error adding entity:', error);
    }
}

export const deleteEntity = async (vehicleId, setError, setSuccess) => {
    try {
        const response = await api.delete(`${BASE_API_URL}/vehicle/${vehicleId}`);
        setSuccess({message: `Vehicle with id [${vehicleId}] was successfully deleted.`});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error('Error deleting entity: ', error);
    }
}

export const makeAdminRequest = async (userId, setError, setSuccess) => {
    try {
        const response = await api.post(`${BASE_API_URL}/user/admin/request`);
        setSuccess({message: "Admin request was successfully sent."});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error('Error making admin request:', error);
    }
}

export const getAdminRequests = async (setError, setSuccess) => {
    try {
        const response = await api.get(`${BASE_API_URL}/user/admin/requests`);
        setSuccess({message: "Admin requests was successfully got."});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error('Error getting admin requests:', error);
    }
}

export const approveAdminRequest = async (requestId, setError, setSuccess) => {
    try {
        const response = await api.post(`${BASE_API_URL}/user/admin/request/${requestId}/approve`);
        setSuccess({message: `Admin request with id [${requestId}] was successfully approved.`});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error('Error approving admin request:', error);
    }
}

export const declineAdminRequest = async (requestId, setError, setSuccess) => {
    try {
        const response = await api.post(`${BASE_API_URL}/user/admin/request/${requestId}/decline`);
        setSuccess({message: `Admin request with id [${requestId}] was successfully declined.`});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error('Error declining admin request:', error);
    }
}

export const groupByEnginePower = async (setError, setSuccess) => {
    try {
        const response = await api.get(`${BASE_API_URL}/vehicle/query/group-by-engine-power`);
        setSuccess({message: "Grouped by engine power successfully."});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error("Error grouping by engine power: ", error);
    }
};

export const countByFuelConsumption = async (neededFuelConsumption, setError, setSuccess) => {
    try {
        const response = await api.get(`${BASE_API_URL}/vehicle/query/count-by-fuel-consumption/${neededFuelConsumption}`);
        setSuccess({message: "Count by fuel consumption retrieved successfully."});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error("Error counting by fuel consumption: ", error);
    }
};

export const countByFuelTypeLessThan = async (neededFuelType, setError, setSuccess) => {
    try {
        const response = await api.get(`${BASE_API_URL}/vehicle/query/count-by-fuel-type-less-than/${neededFuelType}`);
        setSuccess({message: "Count by fuel type retrieved successfully."});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error("Error counting by fuel type: ", error);
    }
};

export const findByEnginePowerRange = async (minPower, maxPower, setError, setSuccess) => {
    try {
        const response = await api.get(`${BASE_API_URL}/vehicle/query/find-by-engine-power-range/${minPower}/${maxPower}`);
        setSuccess({message: "Vehicles by engine power range retrieved successfully."});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error("Error finding by engine power range: ", error);
    }
};

export const findByWheelCountRange = async (minNumber, maxNumber, setError, setSuccess) => {
    try {
        const response = await api.get(`${BASE_API_URL}/vehicle/query/find-by-wheel-count-range/${minNumber}/${maxNumber}`);
        setSuccess({message: "Vehicles by wheel count range retrieved successfully."});
        return response.data;
    } catch (error) {
        setError(error.response.data);
        console.error("Error finding by wheel count range: ", error);
    }
};