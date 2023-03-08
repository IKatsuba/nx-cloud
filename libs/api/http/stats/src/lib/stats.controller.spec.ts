import { Test } from '@nestjs/testing';
import { StatsController } from './stats.controller';

describe('StatsController', () => {
  let controller: StatsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [StatsController],
    }).compile();

    controller = module.get(StatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should return ok', () => {
    expect(
      controller.stats({
        command: 'command',
        isCI: true,
        useCloud: true,
        meta: 'sss',
      })
    ).toBeUndefined();
  });
});
