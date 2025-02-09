import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { AuthorsModule } from '../authors/authors.module';
import { CategoriesModule } from '../categories/categories.module';

describe('BooksModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'db.sqlite',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                    autoLoadEntities: true
                }),
                BooksModule,AuthorsModule, CategoriesModule],
        }).compile();
    });

    it('should compile the module', async () => {
        expect(module).toBeDefined();
        expect(module.get(BooksController)).toBeInstanceOf(BooksController);
        expect(module.get(BooksService)).toBeInstanceOf(BooksService);
    });
});