import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      id: answer.id,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
      content: answer.content,
    }
  }
}
