import { DefaultAnswer } from './default-answer.interface';
import { PaginationInfo } from './pagination-info.interface';

export interface AnswerArraySessionsPopulate1 {
  data: Array<{
    id: number;
    attributes: {
      [key: string]: any;
      user: DefaultAnswer;
      creator: DefaultAnswer;
      equipment: DefaultAnswer;
    };
  }>;
  meta: {pagination: PaginationInfo};
}
