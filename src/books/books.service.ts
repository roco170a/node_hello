import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookCategory } from './entities/book-category.entity';
import { IPaginationOptions } from '../pagination/interfaces/pages.interfaces';
import { paginate } from '../pagination/paginate';
import { Pagination } from '../pagination/pagination';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(BookCategory)
    private bookCategoryRepository: Repository<BookCategory>,
  ) {}

  create(createBookDto: CreateBookDto) {
    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  findAllFiltered(filters: { author?: string; title?: string; category?: string }) {
    const query = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.bookCategories', 'bookCategories')
      .leftJoinAndSelect('bookCategories.category', 'category');

    if (filters.author) {
      query.orWhere('author.name LIKE :author', { author: `%${filters.author}%` });
    }
    if (filters.title) {
      query.orWhere('book.title LIKE :title', { title: `%${filters.title}%` });
    }
    if (filters.category) {
      query.orWhere('category.name LIKE :category', { category: `%${filters.category}%` });
    }

    return query.getMany();
  }

  findAll() {
    const query = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.bookCategories', 'bookCategories')
      .leftJoinAndSelect('bookCategories.category', 'category');

    return query.getMany();
  }

  findAllDeleted() {
    const query = this.booksRepository
      .createQueryBuilder('book').withDeleted()
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.bookCategories', 'bookCategories')
      .leftJoinAndSelect('bookCategories.category', 'category');
      
    return query.getMany();
  }

  async findOne(id: number) {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['author', 'bookCategories', 'bookCategories.category'],
    });
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return this.booksRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    return this.booksRepository.remove(book);
  }

  async removesoft(id: number) {
    return this.booksRepository.softDelete(id);
  }

  async addCategories(bookId: number, categoryIds: number[]) {
    const book = await this.findOne(bookId);
    const bookCategories = categoryIds.map(categoryId => {
      return this.bookCategoryRepository.create({
        bookId: book.id,
        categoryId,
      });
    });
    return this.bookCategoryRepository.save(bookCategories);
  }

  async removeCategory(bookId: number, categoryId: number) {
    const bookCategory = await this.bookCategoryRepository.findOne({
      where: { bookId, categoryId },
    });
    if (!bookCategory) {
      throw new NotFoundException(`Category #${categoryId} not found for book #${bookId}`);
    }
    return this.bookCategoryRepository.remove(bookCategory);
  }
  
  async findAllPaged(options: IPaginationOptions): Promise<Pagination<Book>> {

    const query = this.booksRepository
      .createQueryBuilder('book')
      /*
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.bookCategories', 'bookCategories')
      .leftJoinAndSelect('bookCategories.category', 'category');
      */
      //query.orWhere('1=1');


    return paginate<Book>(query, options,);
  }
}