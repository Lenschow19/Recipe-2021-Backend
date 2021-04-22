import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientEntryEntity } from './ingredient-entry.entity';
import { IngredientEntry } from '../../../../core/models/ingredient-entry';
import { RecipeEntity } from './recipe.entity';

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

  @OneToMany(() => RecipeEntity, (recipeEntity: RecipeEntity) => recipeEntity.user)
  public recipes?: RecipeEntity[]

}
