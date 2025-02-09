import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  
  @ApiOperation({ summary: 'Recupera todas las categorias' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Categoría(s)', type: Category, schema: { $ref: getSchemaPath(Category), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Crea una categoría' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Categoría(s)', type: Category, schema: { $ref: getSchemaPath(Category), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Recupera todas las categorias incluidas las soft deleted' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Categoría(s)', type: Category, schema: { $ref: getSchemaPath(Category), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Get('withSoftDeleted')
  findAllDelInc() {
    return this.categoriesService.findAlldeleted();
  }

  @ApiOperation({ summary: 'Recupera la categoría que sea igual al ID' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Categoría(s)', type: Category, schema: { $ref: getSchemaPath(Category), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualiza una categoría' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Categoría(s)', type: Category, schema: { $ref: getSchemaPath(Category), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Elimina una categoría' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Categoría(s)', type: Category, schema: { $ref: getSchemaPath(Category), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

  @ApiOperation({ summary: 'Elimina una categoría' }) // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Categoría(s)', type: Category, schema: { $ref: getSchemaPath(Category), }, })
  @ApiBadRequestResponse({ description: 'El servidor no puede procesar su solicitud.' }) 
  @Delete('soft/:id')
  removesoft(@Param('id') id: string) {
    return this.categoriesService.removesoft(+id);
  }

}