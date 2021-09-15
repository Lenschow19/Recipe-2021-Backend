import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Entity()
export class IngredientEntryEntity {

  @PrimaryGeneratedColumn()
  public ID: number;

  @Column()
  public name: string;

  @Column("decimal", { precision: 8, scale: 2 })
  public amount: number;

  @Column()
  public measurementUnit: string;

  @Index()
  @ManyToOne(() => RecipeEntity, (recipe: RecipeEntity) => recipe.ingredientEntries, { onDelete: "CASCADE"})
  public recipe: RecipeEntity
}


