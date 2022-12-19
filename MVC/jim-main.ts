interface dataState{
userId:string,
username:string,
userPhoto:string,
}
interface resultState{
data:dataState[],
isError: boolean
errMessage:string
}

type onlyOneRequired = Partial<dataState> & {userId: string}

export class Student{
result:resultState

constructor(){
    this.result = {
        data:[{
            userId:'',
            username:'',
            userPhoto:''    
        }],
        isError:true,
        errMessage:''
    }
}

getter(){
    return this.result 
}

patchResult(obj:{isError:boolean} | {errMessage:string}){
    Object.assign(this.result,obj)
}

patchSingleData(obj:onlyOneRequired){    
    this.result.data = this.result.data.map(rObj=>rObj.userId === obj.userId ? Object.assign(rObj,obj) : rObj)
}

setData(arr:dataState[]){
    this.result.data = arr
}

checkReqBodyExistRequiredKey(obj:dataState){
    Object.keys(obj).forEach(val=>{
        if(val !== 'userId' && val !== 'username'){
            throw new Error('Not existing required key')
        }
    })

}
checkReqParamExistRequiredKey(obj:dataState){
    Object.keys(obj).forEach(val=>{
        if(val !== 'userId' && val !== 'username'){
            throw new Error('Not existing required key')
        } 
    })
}