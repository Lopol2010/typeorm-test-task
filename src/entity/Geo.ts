import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

// @Entity()
export class Geo {

    // @PrimaryGeneratedColumn()
    // id: number;
    
    @Column({type: "float"})
    lat: number;

    @Column({type: "float"})
    lng: number;
    
}

