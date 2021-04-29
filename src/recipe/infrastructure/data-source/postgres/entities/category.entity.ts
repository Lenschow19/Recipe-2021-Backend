import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Entity()
export class CategoryEntity {

  @PrimaryGeneratedColumn()
  public ID: number;

  @Column()
  public title: string;

  @OneToMany(() => RecipeEntity, (recipe: RecipeEntity) => recipe.category)
  public recipes?: RecipeEntity[]

}
