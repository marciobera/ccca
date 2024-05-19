import pgp from "pg-promise";

// Port
export default interface RideDAO {
    save(ride: any): Promise<void>;
    getById(rideId: string): Promise<any>;
    getActiveRidesByPassengerId(passengerId: string): Promise<any>;
}

// Adapter Database
export class RideDAODatabase implements RideDAO {
    async save(ride: any) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date]);
        await connection.$pool.end();
    }

    async getById(rideId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [ride] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        await connection.$pool.end();
        return ride;
    }

    async getActiveRidesByPassengerId(passengerId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const activeRides = await connection.query("select * from ccca.ride where passenger_id = $1 and status = 'requested'", [passengerId]);
        await connection.$pool.end();
        return activeRides;
    }
}
