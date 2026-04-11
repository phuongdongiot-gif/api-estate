import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file')) // Key forms must be 'file'
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    try {
      const result = await this.cloudinaryService.uploadImage(file);
      return {
        success: true,
        url: result.secure_url,
        message: 'Image uploaded successfully to Cloudinary',
      };
    } catch (error) {
      throw new BadRequestException('Image upload failed: ' + error.message);
    }
  }
}
