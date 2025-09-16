import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Attachment } from '../../enterprise/entities/attachment'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
    })

    const attachment = Attachment.create({
      url,
      title: fileName,
    })

    await this.attachmentRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
