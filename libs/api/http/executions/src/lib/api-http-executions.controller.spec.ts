import { Test } from '@nestjs/testing';
import { ApiHttpExecutionsController } from './api-http-executions.controller';

xdescribe('ApiHttpExecutionsController', () => {
  let controller: ApiHttpExecutionsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiHttpExecutionsController],
    }).compile();

    controller = module.get(ApiHttpExecutionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
