import { DefaultAnswer } from './default-answer.interface';

export interface AnswerArrayStudentsPopulate1 {
  data: Array<{
    id: number;
    attributes: {
      user: DefaultAnswer;
      group: DefaultAnswer;
    };
  }>;
}
