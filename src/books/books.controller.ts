import { Controller, Get, Post, Body, Put, Param, Delete, Query, HttpStatus, HttpException } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBody, ApiNotFoundResponse, ApiOperation, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { NotFoundError } from 'rxjs';
import { IPaginationOptions } from '../pagination/interfaces/pages.interfaces';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get()
  @ApiOperation({ summary: 'Recupera todos los libros' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Se localizaron los libros.', type: Book, isArray: true, schema: { $ref: getSchemaPath(Book), }, })
  @ApiNotFoundResponse({ description: 'No localizado.' }) 
  findAll() {
      return this.booksService.findAll();
  }

  @Get('withSoftDeleted')
  @ApiOperation({ summary: 'Recupera todos los libros incluidos los soft deleted' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Se localizaron los libros.', type: Book, isArray: true, schema: { $ref: getSchemaPath(Book), }, })
  @ApiNotFoundResponse({ description: 'No localizado.' }) 
  findAllDeleted() {
      return this.booksService.findAllDeleted();
  }


  @Get('filtered')
  @ApiOperation({ summary: 'Recupera todos los libros aplicando un filtro' }) // Descripción en Swagger
  @ApiQuery({ name: "author", type: String, description: "Nombre del Autor", required: false, example: "Robert" })
  @ApiQuery({ name: "title", type: String, description: "Título del libro", required: false, example: "Atómico" })
  @ApiQuery({ name: "category", type: String, description: "Categoría de libro", required: false, example: "No Fic" })  
  @ApiResponse({ status: 200, description: 'Se localizaron los libros.', type: Book, isArray: true, schema: { $ref: getSchemaPath(Book), }, })
  @ApiNotFoundResponse({ description: 'No localizado.' }) 
  findAllFiltered(
    @Query('author') author?: string,
    @Query('title') title?: string,
    @Query('category') category?: string,
  ) {
    if (!author && !title && !category) {
      return this.booksService.findAll();
    } else {
      return this.booksService.findAllFiltered({ author, title, category });
    }
  }

  @Get('byId/:id')
  @ApiOperation({ summary: 'Recupera el libro que sea igual al ID' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Se localizaron los libros.', type: Book, schema: { $ref: getSchemaPath(Book), }, })
  @ApiNotFoundResponse({ description: 'No localizado.' }) 
  findOne(@Param('id') id ?: string) {
    return this.booksService.findOne(+id); 
  }

  @Get("paged")
  @ApiOperation({ summary: 'Recupera los libros con paginación' }) // Descripción en Swagger
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numero de página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página (default: 10)' })
  async findAllPaged(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const options: IPaginationOptions = { page, limit };
    return this.booksService.findAllPaged(options);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un libro' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Se localizaron los libros.', type: Book, schema: { $ref: getSchemaPath(Book), }, })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza un libro' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Se localizaron los libros.', type: Book, schema: { $ref: getSchemaPath(Book), }, })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un libro (que no tenga categorias relacionadas)' }) // Descripción en Swagger
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @Delete('soft/:id')
  @ApiOperation({ summary: 'Elimina un libro (que no tenga categorias relacionadas)' }) // Descripción en Swagger
  removesoft(@Param('id') id: string) {
    return this.booksService.removesoft(+id);
  }


  @Post(':id/categories')
  @ApiOperation({ summary: 'Actualiza las categorias a un libro' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Se localizaron los libros.', type: Book, schema: { $ref: getSchemaPath(Book), }, })
  @ApiBody({
    type: [Number], // Especifica el tipo del cuerpo
    examples: {
      Unico: {
        value: [1], // Ejemplo 1
        description: 'Asigna la categoría 1 al libro definido',
      },
      Multiple: {
        value: [1, 2], // Ejemplo 1
        description: 'Asigna las categorías 1 y 2 al libro definido',
      },
    },
  })
  addCategories(@Param('id') id: string, @Body() categoryIds: number[]) {
    return this.booksService.addCategories(+id, categoryIds);
  }

  @Delete(':id/categories/:categoryId')
  @ApiOperation({ summary: 'Elimina categorias a un libro' }) // Descripción en Swagger
  removeCategory(@Param('id') id: string, @Param('categoryId') categoryId: string) {
    return this.booksService.removeCategory(+id, +categoryId);
  }
  
}