import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientEntry } from '../../../../core/models/ingredient-entry';
import { IngredientEntryEntity } from './ingredient-entry.entity';
import { UserEntity } from './user.entity';

@Entity()
export class RecipeEntity {

  @PrimaryGeneratedColumn()
  public ID: number;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public preparations: string;

  @Column()
  public imageURL: string;

  @OneToMany(() => IngredientEntryEntity, (ingredientEntity: IngredientEntryEntity) => ingredientEntity.recipe)
  public ingredientEntries?: IngredientEntry[]

  @Index()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.recipes)
  public user: UserEntity

}