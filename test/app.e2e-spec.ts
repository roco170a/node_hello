import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../src/authors/entities/author.entity';
import { Book } from '../src/books/entities/book.entity';
import { Category } from '../src/categories/entities/category.entity';
import { BookCategory } from '../src/books/entities/book-category.entity';

describe('Library Management System (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Author, Book, Category, BookCategory],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authors', () => {
    const author = {
      name: 'Roberto Corona',
      dateOfBirth: '2025-02-06',
    };

    let authorId: number;

    it('POST /authors', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send(author)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(author.name);
          authorId = res.body.id;
        });
    });

    it('GET /authors', () => {
      return request(app.getHttpServer())
        .get('/authors')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('GET /authors/:id', () => {
      return request(app.getHttpServer())
        .get(`/authors/${authorId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(authorId);
          expect(res.body.name).toBe(author.name);
        });
    });
  });

  describe('Categories', () => {
    const category = {
      name: 'Fiction',
    };

    let categoryId: number;

    it('POST /categories', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .send(category)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(category.name);
          categoryId = res.body.id;
        });
    });

    it('GET /categories', () => {
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Books', () => {
    let authorId: number;
    let categoryId: number;
    let bookId: number;

    beforeAll(async () => {
      // Create author
      const authorRes = await request(app.getHttpServer())
        .post('/authors')
        .send({ name: 'Roberto Corona', dateOfBirth: '2025-02-06' });
      authorId = authorRes.body.id;

      // Create category
      const categoryRes = await request(app.getHttpServer())
        .post('/categories')
        .send({ name: 'Test Category' });
      categoryId = categoryRes.body.id;
    });

    it('POST /books', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          authorId,
          publishedDate: '2023-01-01',
          genre: 'Fiction',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Book');
          bookId = res.body.id;
        });
    });

    it('POST /books/:id/categories', () => {
      return request(app.getHttpServer())
        .post(`/books/${bookId}/categories`)
        .send([categoryId])
        .expect(201);
    });

    it('GET /books with filters', () => {
      return request(app.getHttpServer())
        .get('/books')
        .query({
          title: 'Test',
          author: 'Test',
          category: 'Test',
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});