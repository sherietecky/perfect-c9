import { StudentService } from '../services/StudentService';
import * as express from 'express';

import multer from 'multer'
import {Student} from '../oop/student'
export class StudentRouter {
    constructor(private studentService: StudentService,private upload:multer.Multer) {
    console.log(this.studentService)
}

router() {
    const router = express.Router();
    router.post("/submitForm",this.upload.single('photo'),this.addStudent)
    return router;
}
getStudents = async (req: express.Request, res: express.Response) => {
    let student = new Student()
    try{
        // results = get students from DB
        // student.setData(results)

        student.patchResult({isError:false})
        res.json(student.getter())

    }catch(err){
        student.patchResult({isError:true,errMessage:err.message})
        res.json(student.getter())
    }
}    
getSingleStudent = async (req: express.Request, res: express.Response) => {
    let student = new Student()
    try{
        // result = get Single student from DB
        // student.patchSingleData(result)
        student.patchResult({isError:false})

        res.json(student.getter())
    }catch(err){
        student.patchResult({isError:true,errMessage:err.message})
        res.json(student.getter())
    }

}


addStudent = async (req: express.Request, res: express.Response) => {
    let student = new Student()
    try{
        student.checkReqBodyExistRequiredKey(req.body)

        if(req.file != null){    
            student.patchSingleData({userId:req.body.userId,userPhoto:req.file.filename})
        }

        // after add new row to DB
        student.patchSingleData({userId:req.body.userId,username:req.body.username})

        student.patchResult({isError:false})

        res.json(student.getter())
    }catch(err){
        student.patchResult({isError:true,errMessage:err.message})
        res.json(student.getter())
    }

}

patchStudent = async (req: express.Request, res: express.Response) => {
    let student = new Student()
    try{
        student.checkReqBodyExistRequiredKey(req.body)
        // result = patch Single student from DB
        // student.patchSingleData(result)

        res.json(student.getter())
    }catch(err){
        student.patchResult({isError:true,errMessage:err.message})
        res.json(student.getter())
    }
}