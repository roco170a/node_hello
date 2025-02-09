import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Library Management API! <br> go to <a href="/api">/api</a> to try it';
  }
}
