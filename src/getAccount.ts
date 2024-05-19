import AccountDAO, { AccountDAODatabase } from "./AccountDAO";

export default class GetAccount {
    // Port
    constructor(readonly accountDAO: AccountDAO) { }

    async execute(accountId: string) {
        const account = await this.accountDAO.getById(accountId);
        // account.is_passenger = account.isPassenger;
        // account.is_driver = account.isDriver;
        // account.car_plate = account.carPlate;
        return account;
    }
}

export interface GetAccountDAO {
    getById(accountId: string): Promise<any>;
}
