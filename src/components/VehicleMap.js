import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {ErrorContext} from "../context/ErrorContext";
import CreateVehicleForm from "./CreateVehicleForm";
import {getEntities} from "../api/api";

const VehicleMap = ({setFilters}) => {
    const [data, setData] = useState([]);
    const mapRef = useRef(null);
    const ymapsRef = useRef(null);
    const {setError, setSuccess} = useContext(ErrorContext);

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchData = useCallback(async () => {
        const data = await getEntities({
            name: "",
            fuelType: "",
            vehicleType: "",
            sortBy: "id",
            ascending: true,
            page: 0,
            size: 1000000000,
        }, setFilters, setError, () => {
        });
        setData(data);
    }, [setFilters, setError]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [fetchData]);

    // useEffect(() => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         size: 1000000,
    //         page: 0
    //     }));
    // }, [setFilters]);

    const openForm = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsFormOpen(true);
    }

    const closeForm = () => {
        setSelectedVehicle(null);
        setIsFormOpen(false);
    }

    const getBaseSvgIconForType = (type) => {
        switch (type) {
            case 'SHIP':
                return 'icons/ship.svg';
            case 'HOVERBOARD':
                return 'icons/hoverboard.svg';
            case 'MOTORCYCLE':
                return 'icons/motorcycle.svg';
            default:
                return 'icons/default.svg';
        }
    };

    const getColoredIcon = async (iconUrl, color) => {
        try {
            const response = await fetch(iconUrl);
            let svgText = await response.text();

            svgText = svgText.replace(/fill="[^"]*"/g, `fill="${color}"`);

            return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`;
        } catch (error) {
            console.error('Error loading or processing SVG: ', error);
            setError('An unexpected error. See more in console.');
        }
    };

    const computeColorForVehicle = (vehicle) => {
        const hash = vehicle.user.id % 360;
        return `hsl(${hash}, 100%, 50%)`;
    };

    // const fetchData = useCallback(async () => {
    //     try {
    //         const data = await getEntities({
    //             name: "",
    //             fuelType: "",
    //             vehicleType: "",
    //             sortBy: "id",
    //             ascending: true,
    //             page: 0,
    //             size: 1000000000,
    //         }, setFilters, setError, () => {
    //         });
    //         setdata(data);
    //     } catch (err) {
    //         setError(err.response?.data || "An unexpected error occurred.");
    //     }
    // }, [filters, setFilters, setError, setdata]);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const loadYMaps = () => {
            return new Promise((resolve) => {
                if (window.ymaps && window.ymaps.Map) {
                    resolve(window.ymaps);
                } else {
                    const script = document.createElement('script');
                    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=your-api-key";
                    script.onload = () => resolve(window.ymaps);
                    document.head.appendChild(script);
                }
            });
        };

        loadYMaps().then(async (ymaps) => {
            if (!ymapsRef.current && ymaps.Map) {
                ymapsRef.current = new ymaps.Map(mapRef.current, {
                    center: [59.9386, 30.3141],
                    zoom: 5,
                    type: 'yandex#hybrid'
                });
            }

            ymapsRef.current.geoObjects.removeAll();

            for (const vehicle of data) {
                const {x, y} = vehicle.coordinates;
                const color = computeColorForVehicle(vehicle);
                const iconUrl = getBaseSvgIconForType(vehicle.type);
                const icon = await getColoredIcon(iconUrl, color);  // Awaiting getColoredIcon here
                const placemark = new ymaps.Placemark(
                    [y, x],
                    {
                        hintContent: `Тип: ${vehicle.type}\nId: ${vehicle.id}\nOwned by: ${vehicle.user.id}`
                    },
                    {
                        iconLayout: 'default#image',
                        iconImageHref: icon,
                        iconImageSize: [30, 30],
                    }
                );

                placemark.events.add('click', () => openForm(vehicle));

                ymapsRef.current.geoObjects.add(placemark);
            }
        }).catch((err) => {
            setError({message: "An unexpected error. See more in console."});
            console.error('Error loading Yandex Maps API:', err);
        });
    }, [setError, data]);

    return (
        <div ref={mapRef} style={{width: '100%', minHeight: '83.9vh'}}>
            {isFormOpen && (
                <CreateVehicleForm
                    vehicle={selectedVehicle}
                    onClose={closeForm}
                    onSave={fetchData}
                    setError={setError}
                    setSuccess={setSuccess}
                />
            )}
        </div>
    );
};

export default VehicleMap;
