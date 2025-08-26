import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const createAnswerQuestionBodySchema = z.object({
  content: z.string(),
})

type CreateAnswerQuestionBodySchema = z.infer<
  typeof createAnswerQuestionBodySchema
>

@Controller('/questions/:questionId/answers')
export class CreateAnswerQuestionController {
  constructor(private createAnswerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createAnswerQuestionBodySchema))
    body: CreateAnswerQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.createAnswerQuestion.execute({
      content,
      questionId,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
