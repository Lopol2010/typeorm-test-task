import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, PrimaryColumn} from "typeorm";
import { Address } from "./Address";
import { Company } from "./Company";

@Entity()
export class User {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @OneToOne(type => Address)
    @JoinColumn()
    address: Address;

    @Column()
    phone: string;

    @Column()
    website: string;

    @OneToOne(type => Company)
    @JoinColumn()
    company: Company;
}
