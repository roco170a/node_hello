import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @ApiProperty({
        example: 'Adultos',
        description: 'Nombre de la categoría',
        maxLength: 100
    })
    @IsNotEmpty()
    @IsString()
    name: string;
}