import express from "express"
import { C9Service } from "./service"
export class C9Router{
    constructor(private c9Service:C9Service){

    }
    router(){
        const router = express.Router()
        router.get("/marketdata/:product",this.getProducts)
        return router
    }

    getProducts = async (req:Express.Request,res:Express.Response)=>{

    }    
}