import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Adultos',
    description: 'Nombre de la categoría',
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}