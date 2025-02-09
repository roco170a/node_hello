import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Library Management API! <br> go to <a href="/api">/api</a> to try it"', () => {
      expect(appController.getHello()).toBe('Library Management API! <br> go to <a href="/api">/api</a> to try it');
    });
  });
});
