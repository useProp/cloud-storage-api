import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity, FileType } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepo: Repository<FileEntity>,
  ) {}

  async findAll(userId: number, fileType: FileType) {
    const qb = this.fileRepo.createQueryBuilder('file');

    qb.where('file.userId = :userId', { userId });

    if (fileType === FileType.PHOTOS) {
      qb.andWhere('file.mimetype ILIKE :type', { type: '%image%' });
    }

    if (fileType === FileType.TRASH) {
      qb.withDeleted().andWhere('file.deletedAt IS NOT NULL');
    }

    return qb.getMany();
  }

  async create(file: Express.Multer.File, userId: number) {
    return this.fileRepo.save({
      fileName: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    });
  }

  async remove(userId: number, ids: string) {
    const idsArr = ids.split(',');

    const qb = this.fileRepo.createQueryBuilder('file');

    qb.where('id IN (:...ids) AND userId = :userId', {
      userId,
      ids: idsArr,
    });

    return qb.softDelete().execute();
  }
}
