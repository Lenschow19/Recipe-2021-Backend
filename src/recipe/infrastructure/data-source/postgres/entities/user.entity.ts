import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn()
  public ID: number;

  @Column()
  public username: string;

  @Column()
  public password: string;

  @Column()
  public salt: string;

}
