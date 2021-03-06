import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientEntry } from '../../../../core/models/ingredient-entry';
import { IngredientEntryEntity } from './ingredient-entry.entity';
import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { RatingEntity } from './rating.entity';
import { FavoriteEntity } from './favorite.entity';

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

  @OneToMany(() => IngredientEntryEntity, (ingredientEntity: IngredientEntryEntity) => ingredientEntity.recipe, {cascade: true})
  public ingredientEntries?: IngredientEntry[]

  @OneToMany(() => RatingEntity, (ratingEntity: RatingEntity) => ratingEntity.recipe, {cascade: true})
  public ratings?: RatingEntity[]

  @OneToMany(() => FavoriteEntity, (favoriteEntity: FavoriteEntity) => favoriteEntity.recipe, {cascade: true})
  public favorites?: FavoriteEntity[]

  @Index()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.recipes)
  public user: UserEntity

  @Index()
  @ManyToOne(() => CategoryEntity, (category: CategoryEntity) => category.recipes)
  public category: CategoryEntity

}
