import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Author {

  @Field( () => Int )
  @ApiProperty({
    example: '1',
    description: 'Identificador del autor',
    type: Number
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Field( () => String )
  @ApiProperty({
    example: 'Roberto Corona',
    description: 'Nombre del autor',
    maxLength: 100
  })
  @Column()
  name: string;

  @Field( () => String )
  @ApiProperty({
    example: '2025-02-06',
    description: 'Fecha de nacimiento',
    type: Date
  })
  @Column({ type: 'date' })
  dateOfBirth?: Date;

  @ApiProperty({ type: () => Book })
  @OneToMany(() => Book, book => book.author)
  books?: Book[];

  @DeleteDateColumn({ name: 'deleted_at', nullable: true }) // Campo para soft delete
  deletedAt?: Date;
}