import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Product {
    @PrimaryColumn()
    sku!: string;

    @Column()
    name!: string;

    @Column("decimal")
    price!: number;

    @Column("text", { array: true, nullable: true })
    images!: string[];
}
