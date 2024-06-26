
import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";

// Port
export default interface AccountRepository {
    save(account: Account): Promise<void>;
    getByEmail(email: string): Promise<Account | undefined>;
    getById(accountId: string): Promise<Account | undefined>;
}

// Adapter Database
export class AccountRepositoryDatabase implements AccountRepository {
    constructor(readonly connection: DatabaseConnection) { }

    async save(account: Account) {
        await this.connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver])
    }

    async getByEmail(email: string) {
        const [account] = await this.connection.query("select * from ccca.account where email = $1", [email]);
        if (!account) return;
        return Account.restore(account.account_id, account.name, account.email, account.cpf, account.is_passenger, account.is_driver, account.car_plate);
    }

    async getById(accountId: string) {
        const [account] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
        if (!account) return;
        return Account.restore(account.account_id, account.name, account.email, account.cpf, account.is_passenger, account.is_driver, account.car_plate);
    }
}

// Adapter Memory
export class AccountRepositoryMemory implements AccountRepository {
    accounts: any = [];

    async save(account: any): Promise<void> {
        this.accounts.push(account);
    }
    async getByEmail(email: string): Promise<any> {
        return this.accounts.find((account: any) => account.email === email);
    }
    async getById(accountId: string): Promise<any> {
        return this.accounts.find((account: any) => account.accountId === accountId);
    }

}
