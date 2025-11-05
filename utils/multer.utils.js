import multer from 'multer';
import path from 'path';
import fs from 'fs'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(!fs.existsSync('./uploads')){
        fs.mkdirSync('./uploads')
    }
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {

        const orgName = file.originalname;
        const name = path.parse(orgName).name
        const ext = path.parse(orgName).ext
        const uniq = Date.now()+''+Math.round(Math.random() * 1E9);

        const filename = name+'-'+uniq+ext;


    cb(null, filename)
  }
})


export const upload = multer({ storage: storage })
