import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, DeleteDateColumn } from 'typeorm';
import { Book } from './book.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class BookCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookId: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => Book, book => book.bookCategories)
  book?: Book;

  @ManyToOne(() => Category, category => category.bookCategories)
  category?: Category;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true }) // Campo para soft delete
  deletedAt?: Date;
}