import { Test, TestingModule } from '@nestjs/testing';
import { RunsController } from './runs.controller';

describe('RunsController', () => {
  let controller: RunsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunsController],
    }).compile();

    controller = module.get<RunsController>(RunsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
