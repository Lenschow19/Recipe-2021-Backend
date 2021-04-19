import { Test, TestingModule } from '@nestjs/testing';
import { RecipeGateway } from './recipe.gateway';

describe('RecipeGateway', () => {
  let gateway: RecipeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeGateway],
    }).compile();

    gateway = module.get<RecipeGateway>(RecipeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
