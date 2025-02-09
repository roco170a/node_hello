import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { NotFoundException } from '@nestjs/common';
import { Book } from './entities/book.entity';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [{ id: 1, title: 'Test Book' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as Book[]);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book if it exists', async () => {
      const result = { id: 1, title: 'Test Book' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as Book);

      expect(await controller.findOne("1")).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new book', async () => {
      const newBook = { title: 'New Book', authorId: 1, publishedDate: '2023-01-01', genre: 'Fiction' };
      const result = { id: 1, ...newBook };
      jest.spyOn(service, 'create').mockResolvedValue(result as unknown as Book);

      expect(await controller.create(newBook as unknown as Book)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(newBook);
    });
  });

  describe('update', () => {
    it('should update and return the book', async () => {
      const updatedBook = { id: 1, title: 'Updated Book' };
      jest.spyOn(service, 'update').mockResolvedValue(updatedBook as Book);

      expect(await controller.update("1", updatedBook as Book)).toEqual(updatedBook);
      expect(service.update).toHaveBeenCalledWith(1, updatedBook);
    });
  });

  describe('remove', () => {
    it('should delete the book', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove("1");
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});