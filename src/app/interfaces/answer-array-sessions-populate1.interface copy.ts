import { DefaultAnswer } from './default-answer.interface';

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
}
