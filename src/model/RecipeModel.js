const Pool = require('../config/db')

const getRecipeAll = async () => {
    return new Promise((resolve,reject)=>
        Pool.query(`SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo, category.name AS category, users.username AS author FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON recipe.users_id = users.id`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const getRecipe = (data) => {
    const {search,searchBy, offset, limit} = data

    return new Promise((resolve,reject)=>
        Pool.query(`SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo, category.name AS category, users.username AS author  FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON users_id =users.id WHERE ${searchBy} ILIKE '%${search}%' ORDER BY recipe.id DESC OFFSET ${offset} LIMIT ${limit}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const getRecipeById = async (id) => {
    return new Promise((resolve,reject)=>
        Pool.query(`SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo,recipe.created_at, recipe.users_id,category.name AS category, users.username AS author ,users.photo AS author_photo FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON recipe.users_id = users.id   WHERE recipe.id=${id}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const deleteById = async (id) => {
    return new Promise((resolve,reject)=>
        Pool.query(`DELETE FROM recipe WHERE id=${id}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const postRecipe = async (data) => {
    const{title,ingredients,category_id,users_id,photo} = data
    return new Promise((resolve,reject)=>
        Pool.query(`INSERT INTO recipe(title,ingredients,category_id,photo,users_id)
         VALUES('${title}','${ingredients}',
        ${category_id},'${photo}',${users_id})`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}

const putRecipe = async (data,id) => {
    const{title,ingredients,category_id,photo} = data
    return new Promise((resolve,reject)=>
        Pool.query(`UPDATE recipe SET title='${title}', ingredients='${ingredients}', category_id = ${category_id}, photo ='${photo}' WHERE id=${id}`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}
  const getMyRecipe = async (data) => {
    const { search, searchBy, offset, limit, id, sort } = data;
    return new Promise((resolve, reject) =>
      Pool.query(
        `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo, category.name AS category FROM recipe JOIN category ON recipe.category_id = category.id WHERE users_id = ${id} AND ${searchBy} ILIKE '%${search}%' ORDER BY title ${sort} OFFSET ${offset} LIMIT ${limit}`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      )
    );
  }
const getRecipeCount = async (data) => {
    const {search, searchBy, offset, limit} = data
    return new Promise((resolve,reject)=>
        Pool.query(`SELECT COUNT(*) FROM recipe JOIN category ON recipe.category_id = category.id WHERE ${searchBy} ILIKE '%${search}%'`,(err,result)=>{
            if(!err){
                resolve(result)
            } else{
                reject(err)
            }
        })
    )
}
module.exports =  {getRecipe,getRecipeById,deleteById,postRecipe,putRecipe,getRecipeAll,getRecipeCount,getMyRecipe}