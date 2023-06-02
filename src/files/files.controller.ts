import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../decorators/user-id.decorator';
import { FileType } from './entities/file.entity';

@Controller('files')
@ApiTags('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async findAll(@UserId() id: number, @Query('type') fileType: FileType) {
    return this.filesService.findAll(id, fileType);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @UploadedFile(new ParseFilePipe()) file: Express.Multer.File,
    @UserId() userId: number,
  ) {
    return this.filesService.create(file, userId);
    {
      validators: new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 });
    }
  }

  @Delete()
  async remove(@UserId() id: number, @Query('ids') ids: string) {
    return this.filesService.remove(id, ids);
  }
}
