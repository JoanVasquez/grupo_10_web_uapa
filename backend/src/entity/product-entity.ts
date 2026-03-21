import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tbl_products")
export class Product {
  
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;
  
  @Column("decimal")
  price!: number;

  @Column()
  category!: string;

  @Column()
  model!: string;

  @Column("integer", { default: 1 })
  stock!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
