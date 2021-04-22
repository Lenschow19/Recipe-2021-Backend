import { Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Entity()
export class IngredientEntryEntity {

  @PrimaryGeneratedColumn()
  public ID: number;

  @Column()
  public name: string;

  @Column()
  public amount: number;

  @Column()
  public measurementUnit: string;

  @Index()
  @ManyToOne(() => RecipeEntity, (recipe: RecipeEntity) => recipe.ingredientEntries)
  public recipe: RecipeEntity
}
