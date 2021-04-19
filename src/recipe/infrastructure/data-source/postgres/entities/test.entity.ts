import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class TestEntity {

  @PrimaryColumn()
  public id: string;

  @Column()
  public name: string;

}
