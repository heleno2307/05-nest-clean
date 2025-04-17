import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get<PrismaService>(PrismaService)

    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 1',
          content: 'Lorem ipsum dolor sit amet',
          slug: 'question-1',
          authorId: user.id,
        },
        {
          title: 'Question 2',
          content: 'Lorem ipsum dolor sit amet',
          slug: 'question-2',
          authorId: user.id,
        },
        {
          title: 'Question 3',
          content: 'Lorem ipsum dolor sit amet',
          slug: 'question-3',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({
          title: 'Question 1',
        }),
        expect.objectContaining({
          title: 'Question 2',
        }),
        expect.objectContaining({
          title: 'Question 3',
        }),
      ],
    })
  })
})
