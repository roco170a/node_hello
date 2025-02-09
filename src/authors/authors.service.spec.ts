import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { NotFoundException } from '@nestjs/common';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repository: Repository<Author>;

  const mockAuthor = {
    id: 1,
    name: 'Roberto Corona',
    dateOfBirth: new Date('2025-02-06'),
    books: [],
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockAuthor),
    save: jest.fn().mockResolvedValue(mockAuthor),
    find: jest.fn().mockResolvedValue([mockAuthor]),
    findOne: jest.fn().mockResolvedValue(mockAuthor),
    remove: jest.fn().mockResolvedValue(mockAuthor),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    repository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an author', async () => {
      const createAuthorDto = {
        name: 'Roberto Corona',
        dateOfBirth: new Date('2025-02-06'),
      };

      const result = await service.create(createAuthorDto);
      expect(result).toEqual(mockAuthor);
      expect(repository.create).toHaveBeenCalledWith(createAuthorDto);
      expect(repository.save).toHaveBeenCalledWith(mockAuthor);
    });
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockAuthor]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an author', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockAuthor);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['books'],
      });
    });

    it('should throw NotFoundException when author not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an author', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockAuthor);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.remove).toHaveBeenCalledWith(mockAuthor);
    });
  });
});