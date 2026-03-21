import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("tbl_users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  email!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({ type: "boolean", default: true })
  is_active!: boolean;
}
