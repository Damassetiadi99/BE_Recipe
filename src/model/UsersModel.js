const Pool = require('../config/db')

const getUser = (data) => {
    const {search,searchBy, offset, limit} = data

    return new Promise((resolve,reject)=>
        Pool.query(`SELECT users.id, users.name, users.email FROM users WHERE ${searchBy} ILIKE '%${search}%' ORDER BY users.id ASC OFFSET ${offset} LIMIT ${limit}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const getUsersById = async (id) => {
    return new Promise((resolve,reject)=>
        Pool.query(`SELECT * FROM users WHERE id=${id}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}
const getUsersByEmail = async (email) => {
    return new Promise((resolve,reject)=>
        Pool.query(`SELECT * FROM users WHERE email='${email}'`,(err,result)=>{
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
        Pool.query(`DELETE FROM users WHERE id=${id}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const postUser = async (data) => {
    const{name,email} = data
    return new Promise((resolve,reject)=>
        Pool.query(`INSERT INTO users(name,email) VALUES('${name}','${email}')`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

// const putUser = async (data,id) => {
//     const{name,email} = data
//     console.log("model putusers")
//     return new Promise((resolve,reject)=>
//         Pool.query(`UPDATE users SET name='${name}', email='${email}' WHERE id=${id}`,(err,result)=>{
//             if(!err){
//                 resolve(result)
//             } else{
//                 reject(err)
//             }
//         })
//     )
// }
const putUser = async (data, id) => {
    const { username, email, password, photo } = data
    return new Promise((resolve, reject) =>
        Pool.query(`UPDATE users SET username='${username}',email='${email}',password='${password}', photo = '${photo}' WHERE id=${id}`, (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    )
}


const getUserAll = async () => {
    return new Promise((resolve,reject)=>
        Pool.query(`SELECT * FROM users`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const getUserCount = async (data) => {
    const {search, searchBy, offset, limit} = data
    return new Promise((resolve,reject)=>
        Pool.query(`SELECT COUNT(*) FROM users WHERE ${searchBy} ILIKE '%${search}%'`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const createUser = async (data) => {
    let {username,email,password} = data
    return new Promise((resolve,reject)=>
        Pool.query(`INSERT INTO users(username,email,password) VALUES('${username}',
        '${email}','${password}')`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}


module.exports =  {getUser,getUsersById,deleteUserById,postUser,putUser,getUserAll,getUserCount,getUsersByEmail,createUser}