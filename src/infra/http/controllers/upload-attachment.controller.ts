import {
  BadRequestException,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { fileTypeFromBuffer } from 'file-type'

@Controller('/attachments')
export class UploadAttachmentController {
  // constructor() {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileType = await fileTypeFromBuffer(file.buffer)

    if (!fileType) throw new BadRequestException()

    const isValidFyleType = ['jpg', 'jpeg', 'png'].includes(fileType?.ext)

    if (!isValidFyleType) throw new BadRequestException()
    console.log(file)
  }
}
