import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'Roberto Corona',
    description: 'Nombre del autor',
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '2025-02-06',
    description: 'Fecha de nacimiento',
    type: Date
  })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;
}