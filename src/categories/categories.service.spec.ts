import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockCategory = {
    id: 1,
    name: 'No Ficción',
    bookCategories: [],
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockCategory),
    save: jest.fn().mockResolvedValue(mockCategory),
    find: jest.fn().mockResolvedValue([mockCategory]),
    findOne: jest.fn().mockResolvedValue(mockCategory),
    remove: jest.fn().mockResolvedValue(mockCategory),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto = {
        name: 'No Ficción',
      };

      const result = await service.create(createCategoryDto);
      expect(result).toEqual(mockCategory);
      expect(repository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(repository.save).toHaveBeenCalledWith(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories with their books', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCategory]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['bookCategories', 'bookCategories.book'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a category with its books', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockCategory);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['bookCategories', 'bookCategories.book'],
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto = {
        name: 'Updated No Ficción',
      };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      jest.spyOn(repository, 'save').mockResolvedValueOnce(updatedCategory);

      const result = await service.update(1, updateCategoryDto);
      expect(result).toEqual(updatedCategory);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(updatedCategory);
    });

    it('should throw NotFoundException when updating non-existent category', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockCategory);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException when removing non-existent category', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});