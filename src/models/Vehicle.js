export class Vehicle {
    constructor(id, name, coordinates, creationDate, type, enginePower, numberOfWheels, capacity, distanceTravelled, fuelConsumption, fuelType, canBeEditedByAdmin, user) {
        this.id = id;
        this.name = name;
        this.coordinates = {
            id: coordinates.id,
            x: coordinates.x,
            y: coordinates.y
        }
        this.creationDate = creationDate;
        this.type = type;
        this.enginePower = enginePower;
        this.numberOfWheels = numberOfWheels;
        this.capacity = capacity;
        this.distanceTravelled = distanceTravelled;
        this.fuelConsumption = fuelConsumption;
        this.fuelType = fuelType;
        this.canBeEditedByAdmin = canBeEditedByAdmin;
        this.user = {
            id: user.id,
            login: user.username
        }
    }

    static fromApiData(data) {
        return new Vehicle(data.id, data.name, data.coordinates, data.creationDate, data.type, data.enginePower, data.numberOfWheels, data.capacity, data.distanceTravelled, data.fuelConsumption, data.fuelType, data.canBeEditedByAdmin, data.user);
    }

    static getFields() {
        return ['id', 'name', 'coordinateX', 'coordinateY', 'creationDate', 'type', 'enginePower', 'numberOfWheels', 'capacity', 'distanceTravelled', 'fuelConsumption', 'fuelType'];
    }
}