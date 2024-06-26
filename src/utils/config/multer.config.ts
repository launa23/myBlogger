import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import * as process from "node:process";
import * as fs from "node:fs";
import { diskStorage } from "multer";
import e from "express";
import { Error } from "mongoose";
import * as path from "node:path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {

  // Tra ve thu muc goc cua du an nay
  getRootPath = () => {
    return process.cwd();
  }
  // Kiem tra neu thu muc khong ton tai thi tao, con nau co roi thi khong tao moi
  ensureExists(targetDirectory: string){
    fs.mkdir(targetDirectory, {recursive: true}, (err) => {
      if ( !err ){
        console.log('Directory successfully created or it already exists.');
        return;
      }
      switch (err.code){
        case 'EEXIST':
          break;
        case 'ENOTDIR':
          break;
        default:
          console.error(err);
          break;
      }
    })
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      // Cau hinh de luu du lieu o dau
      storage: diskStorage({   // Luu tru file anh ngay ben trong o dia cua may
        destination: (req, file, cb: (error: Error | null, destination: string) => void) => {
          const folder = req?.headers?.folder_type ?? "default";
          this.ensureExists(`public/images/${folder}`);
          cb(null, this.getRootPath() + `/public/images/${folder}`)
        },
        filename(req: e.Request, file: Express.Multer.File, cb: (error: (Error | null), filename: string) => void) {
          // lay extension cua anh
          const extName = path.extname(file.originalname);
          // lay ten anh ( khong co extension )
          const baseName = path.basename(file.originalname, extName);
          // dat ten cho anh bang cach ghep tu extName + baseName
          const finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
      // Validate file gui len
      fileFilter(req: any, file: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer
      }, callback: (error: (Error | null), acceptFile: boolean) => void) {
          const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];
          const fileExtension = file.originalname.split('.').pop().toLowerCase();
          const isValidFileType = allowedFileTypes.includes(fileExtension);

          if( !isValidFileType ){
            callback(new HttpException("Không đúng định dạng file ảnh!", HttpStatus.UNPROCESSABLE_ENTITY), null);
          }
          else{
            callback(null, true);
          }
      },
      limits: {
        fileSize: (1024 * 1024 * 10) // 10MB
      }
    };
  }
}