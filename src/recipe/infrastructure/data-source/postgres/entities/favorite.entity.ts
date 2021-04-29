import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { UserEntity } from './user.entity';

@Entity()
export class FavoriteEntity {

  @Index()
  @ManyToOne(() => RecipeEntity, (recipe: RecipeEntity) => recipe.ratings, {primary: true, onDelete: "CASCADE"})
  public recipe: RecipeEntity;

  @Index()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.ratings, {primary: true, onDelete: "CASCADE"})
  public user: UserEntity;
}
