import { Test } from '@nestjs/testing';
import { ApiReportClientErrorController } from './api-report-client-error.controller';

describe('ApiReportClientErrorController', () => {
  let controller: ApiReportClientErrorController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiReportClientErrorController],
    }).compile();

    controller = module.get(ApiReportClientErrorController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
