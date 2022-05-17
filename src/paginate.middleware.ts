import { Injectable, NestMiddleware } from '@nestjs/common';
@Injectable()
export class PagerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.query.take = +req.query.take || 10;
    req.query.skip = +req.query.skip || 0;
    req.query.nextPage =
      req.query.nextPage + 1 > req.query.skip ? null : req.query.nextPage + 1;
    req.query.prevPage =
      req.query.prevPage - 1 < 1 ? null : req.query.prevPage - 1;
    next();
  }
}
