import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {

    @ApiProperty({
        example: 'Habítos Atómicos',
        description: 'Nombre del libro',
        maxLength: 100
      })
      @IsNotEmpty()
      @IsString()
      title: string;
    
      @ApiProperty({
        example: '1',
        description: 'Identificador del autor',
        type: Number
      })
      @IsNotEmpty()
      @IsNumber()
      authorId: number;
    
      @ApiProperty({
        example: '2025-02-06',
        description: 'Fecha de publicación',
        type: Date
      })
      @IsNotEmpty()
      @IsDateString()
      publishedDate: Date;
    
      @ApiProperty({
        example: 'No Ficción',
        description: 'Nombre del género',
        maxLength: 100
      })
      @IsNotEmpty()
      @IsString()
      genre: string;

}