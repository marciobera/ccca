import pgp from "pg-promise";

export default class AccountDAO {
    async save(account: any) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver])
        await connection.$pool.end();
    }

    async getByEmail(email: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [account] = await connection.query("select * from ccca.account where email = $1", [email]);
        await connection.$pool.end();
        return account;
    }

    async getById(accountId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [account] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
        await connection.$pool.end();
        return account;

    }
}
