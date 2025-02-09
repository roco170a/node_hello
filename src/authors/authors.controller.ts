import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Author } from './entities/author.entity';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  
  @ApiOperation({ summary: 'Recupera todos los autores' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Autor(es).', isArray: true, type: Author, schema: { $ref: getSchemaPath(Author), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Get()
  findAll() {
    return this.authorsService.findAll();
  }

  @ApiOperation({ summary: 'Crea un autore' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Autor(es).', type: Author, schema: { $ref: getSchemaPath(Author), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @ApiOperation({ summary: 'Recupera el autor que sea igual al ID ' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Autor(es).', type: Author, schema: { $ref: getSchemaPath(Author), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Acttualiza un autor' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Autor(es).', type: Author, schema: { $ref: getSchemaPath(Author), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(+id, updateAuthorDto);
  }

  @ApiOperation({ summary: 'Elimina un autor' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Autor(es).', type: Author, schema: { $ref: getSchemaPath(Author), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(+id);
  }
}