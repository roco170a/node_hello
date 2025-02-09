import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    const author = this.authorsRepository.create(createAuthorDto);
    return this.authorsRepository.save(author);
  }

  findAll() {
    return this.authorsRepository.find({ relations: ['books'] });
  }

  async findOne(id: number) {
    const author = await this.authorsRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!author) {
      throw new NotFoundException(`Author #${id} not found`);
    }
    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findOne(id);
    Object.assign(author, updateAuthorDto);
    return this.authorsRepository.save(author);
  }

  async remove(id: number) {
    const author = await this.findOne(id);
    return this.authorsRepository.remove(author);
  }
}