import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  findAll() {
    return this.categoriesRepository.find({
      relations: ['bookCategories', 'bookCategories.book'],
    });
  }

  findAlldeleted() {
    return this.categoriesRepository.find({
      relations: ['bookCategories', 'bookCategories.book'],withDeleted:true
    });
  }


  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['bookCategories', 'bookCategories.book'],
    });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return this.categoriesRepository.remove(category);
  }

  async removesoft(id: number) {
    return this.categoriesRepository.softDelete(id);
  }
}