import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { IngredientEntryEntity } from './ingredient-entry.entity';
import { IngredientEntry } from '../../../../core/models/ingredient-entry';

@Entity()
export class CategoryEntity {

  @PrimaryGeneratedColumn()
  public ID: number;

  @Column()
  public title: string;

  @OneToMany(() => RecipeEntity, (recipe: RecipeEntity) => recipe.category)
  public recipes?: RecipeEntity[]

}
