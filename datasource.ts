import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "tester.sqlite",
    entities: ["src/entities/*.ts"],
    migrations: ["src/migrations/*{.ts,.js}"],
    synchronize: false,
/*
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync('./certs/chain.pem'),
        key: fs.readFileSync('./certs/privkey.pem'),
        cert: fs.readFileSync('./certs/cert.pem'),
    }
*/
});
