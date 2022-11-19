import { Test } from '@nestjs/testing';
import { ApiHttpStatsController } from './stats.controller';

describe('ApiHttpStatsController', () => {
  let controller: ApiHttpStatsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiHttpStatsController],
    }).compile();

    controller = module.get(ApiHttpStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
