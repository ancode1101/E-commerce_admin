import { DataSource } from 'typeorm';
import { Product } from './entity/Product';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root1234",
    database: "ecommerce",
    synchronize: true,
    logging: false,
    entities: [Product],
});
