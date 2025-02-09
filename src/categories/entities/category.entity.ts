import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn, JoinTable } from 'typeorm';
import { BookCategory } from '../../books/entities/book-category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {

  @ApiProperty({
    example: '1',
    description: 'Identificador de la categoría',
    type: Number
})
  @PrimaryGeneratedColumn()
  id: number;


  @ApiProperty({
    example: 'No Ficción',
    description: 'Descripción de la categoría',
    maxLength: 100
  })
  @Column()
  name: string;

  @ApiProperty({ type: () => BookCategory })
  @OneToMany(() => BookCategory, bookCategory => bookCategory.category , {eager:true, cascade: true, onDelete: 'CASCADE', onUpdate:'CASCADE' })
  @JoinTable()
  bookCategories?: BookCategory[];

  @DeleteDateColumn({ name: 'deleted_at', nullable: true }) // Campo para soft delete
  deletedAt?: Date;
}