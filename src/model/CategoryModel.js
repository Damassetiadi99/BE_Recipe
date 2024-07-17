const Pool = require('../config/db')

const getCategory = async () => {
    return new Promise((resolve,reject)=>
        Pool.query(`SELECT * FROM category`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const deleteUserById = async (id) => {
    return new Promise((resolve,reject)=>
        Pool.query(`DELETE FROM category WHERE id=${id}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}
const postCategory = async (data) => {
    const{name} = data
    return new Promise((resolve,reject)=>
        Pool.query(`INSERT INTO category(name) VALUES('${name}')`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const getCategoryById = async (id) => {
    return new Promise((resolve,reject)=>
        Pool.query(`SELECT * FROM category WHERE id=${id}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const putCategory = async (data,id) => {
    const{name} = data
    return new Promise((resolve,reject)=>
        Pool.query(`UPDATE category SET name='${name}' WHERE id=${id}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

module.exports =  {getCategory,deleteUserById,postCategory,getCategoryById,putCategory}