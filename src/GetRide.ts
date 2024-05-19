import RideDAO from "./RideDAO";

export default class GetRide {
    constructor(readonly rideDAO: RideDAO) { }

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideDAO.getById(rideId);
        return ride;
    }
}

type Output = {
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date
}
