import multer from 'multer'

import { Response, CustomRequest } from '../interfaces/http'

const uploadPicture = multer({
  limits: { fileSize: 9e+6 },
  fileFilter: (_, file: any, cb: multer.FileFilterCallback) => {
    cb(null, ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype));
  },
});

const uploadFile = multer({
  limits: { fileSize: 9e+6 },
  fileFilter: (_, file: any, cb: multer.FileFilterCallback) => {
    cb(null, [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ].includes(file.mimetype));
  },
});

const checkPictureToUploadAsync = (req: CustomRequest, res: Response, filename: string) => new Promise((resolve, reject) => {
  uploadPicture.single(filename)(req, res, async (error: any) => {
    if (error) {
      console.log(error)
      reject(error)
    } else {
      resolve(true)
    }
  })
})

const checkPicturesToUploadAsync = (req: CustomRequest, res: Response, filesName: string[]) => new Promise((resolve, reject) => {
  uploadPicture.fields(filesName.map(filename => ({ name: filename, maxCount: 1 })))(req, res, async (error: any) => {
    if (error) {
      console.log(error)
      reject(error)
    } else {
      resolve(true)
    }
  })
})

const checkArrayOfPicturesToUploadAsync = (req: CustomRequest, res: Response, filesArrayName: string, maxCount = 10) =>
  new Promise((resolve, reject) => {
    uploadPicture.array(filesArrayName, maxCount)(req, res, async (error: any) => {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        resolve(true)
      }
    })
})

const checkFileToUploadAsync = (req: CustomRequest, res: Response, filename: string) => new Promise((resolve, reject) => {
  uploadFile.single(filename)(req, res, async (error: any) => {
    if (error) {
      console.log(error)
      reject(error)
    } else {
      resolve(true)
    }
  })
})

export {
  checkPictureToUploadAsync,
  checkPicturesToUploadAsync,
  checkArrayOfPicturesToUploadAsync,
  checkFileToUploadAsync,
}