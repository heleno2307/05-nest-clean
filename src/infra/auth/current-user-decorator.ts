import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenSchema } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext): TokenSchema => {
    const request = context.switchToHttp().getRequest()
    return request.user as TokenSchema
  },
)
