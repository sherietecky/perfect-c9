interface dataState{
    product_id:string,
    product_name:string,
    market_id:string,
    market_name:string,
    price_id:string,
    price:number,
    display_pic:string
}

interface resultState{
    data:dataState[],
    isError:boolean,
    errMess:string
}
type onlyReqOneType = Partial<dataState> & {product_id:string}
export class c9{
    result:resultState
    constructor(){
        this.result = {
            data:[{
            product_id:'',
            product_name:'',
            market_id:'',
            market_name:'',
            price_id:'',
            price:0,
            display_pic:''
        }],
        isError:true,
        errMess:''
        }
    }

    getter(){}
    patchResult(obj:any){
        Object.assign(this.result,obj)
    }
    patchData(obj:onlyReqOneType){
        this.result.data = this.result.data.forEach(rObj=>rObj.product_id === obj.product_id ? Object.assign(rObj,obj) : rObj)
    }
} 

