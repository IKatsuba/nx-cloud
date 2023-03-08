import { Test } from '@nestjs/testing';
import { ApiSaveMetricsController } from './api-save-metrics.controller';

describe('ApiSaveMetricsController', () => {
  let controller: ApiSaveMetricsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ApiSaveMetricsController],
    }).compile();

    controller = module.get(ApiSaveMetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should return ok', () => {
    expect(
      controller.saveMetrics({
        entries: [],
      })
    ).toBeUndefined();
  });
});
