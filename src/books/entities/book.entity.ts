import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { BookCategory } from './book-category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Book {
  @ApiProperty({
    example: '1',
    description: 'Identificador del libro',
    type: Number
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Habítos Atómicos',
    description: 'Nombre del libro',
    maxLength: 100
  })
  @Column()
  title: string;

  @ApiProperty({
    example: '1',
    description: 'Identificador del autor',
    type: Number
  })
  @Column()
  authorId: number;

  @ApiProperty({
    example: '2025-02-06',
    description: 'Fecha de publicación',
    type: Date
  })
  @Column({ type: 'date' })
  publishedDate: Date;

  @ApiProperty({
    example: 'No Ficción',
    description: 'Nombre del género',
    maxLength: 100
  })
  @Column()
  genre: string;

  @ApiProperty({ type: () => Author })
  @ManyToOne(() => Author, author => author.books)
  author: Author;

  @ApiProperty({ type: () => BookCategory })
  @OneToMany(() => BookCategory, bookCategory => bookCategory.book)
  bookCategories: BookCategory[];

  @DeleteDateColumn({ name: 'deleted_at', nullable: true }) // Campo para soft delete
  deletedAt?: Date;
}