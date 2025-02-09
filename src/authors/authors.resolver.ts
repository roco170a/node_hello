import { Resolver, Query } from "@nestjs/graphql";
import { AuthorsService } from "./authors.service";
import { Author } from "./entities/author.entity";
import { Auth } from "typeorm";

@Resolver()
export class AuthorResolver {

    constructor(private readonly authorService: AuthorsService) {}

    @Query(() => [Author], {name: 'Autores'})
    async authors(): Promise<Author[]> {
      return this.authorService.findAll();
    }

}