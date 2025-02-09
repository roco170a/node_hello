import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { BookCategory } from './entities/book-category.entity';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;
  let bookCategoryRepository: Repository<BookCategory>;

  const mockBook = {
    id: 1,
    title: 'Hábitos atómicos',
    authorId: 1,
    publishedDate: new Date('2025-02-06'),
    genre: 'No Ficción',
    author: { id: 1, name: 'Roberto Corona'},
    bookCategories: [],
  };

  const mockBookRepository = {
    create: jest.fn().mockReturnValue(mockBook),
    save: jest.fn().mockResolvedValue(mockBook),
    findOne: jest.fn().mockResolvedValue(mockBook),
    remove: jest.fn().mockResolvedValue(mockBook),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockBook]),
    })),
  };

  const mockBookCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: getRepositoryToken(BookCategory),
          useValue: mockBookCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    bookCategoryRepository = module.get<Repository<BookCategory>>(
      getRepositoryToken(BookCategory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto = {
        title: 'Hábitos atómicos',
        authorId: 1,
        publishedDate: new Date('2025-02-06'),
        genre: 'No Ficción',
      };

      const result = await service.create(createBookDto);
      expect(result).toEqual(mockBook);
      expect(bookRepository.create).toHaveBeenCalledWith(createBookDto);
      expect(bookRepository.save).toHaveBeenCalledWith(mockBook);
    });
  });


  describe('findAll', () => {
    it('should return an array of books with filters', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockBook]);
      expect(bookRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findAllFiltered', () => {
    it('should return an array of books with filters', async () => {
      const filters = {
        author: '',
        title: '',
        category: '',
      };
      const result = await service.findAllFiltered(filters);
      expect(result).toEqual([mockBook]);
      expect(bookRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockBook);
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author', 'bookCategories', 'bookCategories.category'],
      });
    });

    it('should throw NotFoundException when book not found', async () => {
      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto = {
        title: 'Updated Book Title',
        genre: 'Non-Fiction',
      };

      const updatedBook = { ...mockBook, ...updateBookDto };
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(updatedBook as Book);

      const result = await service.update(1, updateBookDto as Book);
      expect(result).toEqual(updatedBook);
      expect(bookRepository.findOne).toHaveBeenCalled();
      expect(bookRepository.save).toHaveBeenCalledWith(updatedBook);
    });
  });



  describe('remove', () => {
    it('should remove a book', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockBook);
      expect(bookRepository.findOne).toHaveBeenCalled();
      expect(bookRepository.remove).toHaveBeenCalledWith(mockBook);
    });
  });

  describe('addCategories', () => {
    it('should add categories to a book', async () => {
      const categoryIds = [1, 2];
      const mockBookCategories = categoryIds.map(categoryId => ({
        id: 0,
        bookId: mockBook.id,
        categoryId,
      }));

      jest.spyOn(bookCategoryRepository, 'create').mockReturnValue(mockBookCategories[0]);
      jest.spyOn(bookCategoryRepository, 'save').mockResolvedValue(mockBookCategories[0]);

      const result = await service.addCategories(1, categoryIds);
      expect(result).toEqual(mockBookCategories[0]);
      expect(bookRepository.findOne).toHaveBeenCalled();
      expect(bookCategoryRepository.create).toHaveBeenCalled();
      expect(bookCategoryRepository.save).toHaveBeenCalled();
    });
  });


  describe('removeCategory', () => {
    const mockBookCategory = {
      id: 1,
      bookId: 1,
      categoryId: 1,
    };

    it('should remove a category from a book', async () => {
      jest.spyOn(bookCategoryRepository, 'findOne').mockResolvedValue(mockBookCategory);
      jest.spyOn(bookCategoryRepository, 'remove').mockResolvedValue(mockBookCategory);

      const result = await service.removeCategory(1, 1);
      expect(result).toEqual(mockBookCategory);
      expect(bookCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { bookId: 1, categoryId: 1 },
      });
      expect(bookCategoryRepository.remove).toHaveBeenCalledWith(mockBookCategory);
    });
  });


});