import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { RatingEntity } from './rating.entity';
import { FavoriteEntity } from './favorite.entity';

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

  @OneToMany(() => RatingEntity, (ratingEntity: RatingEntity) => ratingEntity.user, {cascade: true})
  public ratings?: RatingEntity[]

  @OneToMany(() => FavoriteEntity, (favoriteEntity: FavoriteEntity) => favoriteEntity.user, {cascade: true})
  public favorites?: FavoriteEntity[]

}
