import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Company {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    catchPhrase: string;

    @Column()
    bs: string;

}

