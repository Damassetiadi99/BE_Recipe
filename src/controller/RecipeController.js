const {getRecipe,getRecipeById,deleteById,postRecipe,putRecipe,getRecipeAll,getRecipeCount,getMyRecipe} = require('../model/RecipeModel')

const cloudinary = require ('../config/photo.js')


const RecipeController ={
    getData:async (req,res,next)=>{
        let dataRecipe = await getRecipeAll()
        console.log(dataRecipe)
        if(dataRecipe){
            res.status(200).json({"status":200,"message":"get data recipe success",data:dataRecipe.rows})
        }
    },
     getDataById: async (req,res,next) => {
        const {id} = req.params

        if(!id || id <= 0 || isNaN(id)){
            return res.status(404).json({ "message": "id wrong" });
        }

        let dataRecipeId = await getRecipeById(parseInt(id))

        console.log("dataRecipe")
        console.log(dataRecipeId)

        if(!dataRecipeId.rows[0]){
            return res.status(200).json({"status":200,"message":"get data recipe not found",data:[]})
        }

        return res.status(200).json({"status":200,"message":"get data recipe success",data:dataRecipeId.rows[0]})
    },
    getMyRecipe : async (req, res) => {
        console.log('app error')
        console.log(req.payload)
        try {
          const { search, searchBy, limit, sort } = req.query;
          const {id} = req.payload;
          console.log(req.payload)
          
          let page = req.query.page || 1;
          let limiter = limit || 5;

    
    
          data = {
            search: search || "",
            searchBy: searchBy || "title",
            offset: (page - 1) * limiter,
            limit: limit || 5,
            sort: sort || "ASC",
            id: parseInt(id),
          };
          let dataRecipe = await getMyRecipe(data);
          let dataRecipeCount = await getRecipeCount(data);
          console.log('limit')
          console.log(limiter)
          console.log(limit)
          console.log(req)

         
    
          const pagination = {
            totalPage: Math.ceil(dataRecipeCount.rows[0].count / limiter),
            totalData: parseInt(dataRecipeCount.rows[0].count),
            pageNow: parseInt(page),
          };
    
          if (dataRecipe.rows.length === 0) {
            return res
              .status(404)
              .json({ message: "Result not found", pagination });
          }
    
          res.status(200).json({
            message: "Get recipes sucessfully",
            data: dataRecipe.rows,
            pagination,
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Get recipes pagination failed", error });
        }
      },
    deleteDataById: async(req,res,next)=>{
        try{
            const {id} = req.params

            if(!id || id <= 0 || isNaN(id)){
                return res.status(404).json({ "message": "id wrong" });
            }

            let dataRecipeId = await getRecipeById(parseInt(id))
            console.log(dataRecipeId.rows[0].users_id)

            if (req.payload.id != dataRecipeId.rows[0].users_id) {
                return res.status(403).json({ message: "Recipe is not owned by you" });
              }
            let result = await deleteById(parseInt(id))

            


            console.log(result)
            if(result.rowCount==0){
                throw new Error("delete data failed")
            }
            return res.status(200).json({"status":200,"message":"delete data recipe success",data:result.rows[0]})

        } catch(err){
            return res.status(404).json({"status":404,"message":err.message})
        }
    },
    postData: async(req,res,next)=>{
        const{title,ingredients,category_id} = req.body
        console.log("post file ")
        console.log(req.file)
        console.log("post data ")
        console.log(title,ingredients,category_id)
        const imageCloud = await cloudinary.uploader.upload(req.file.path,{folder : 'recipe'});
        if(!title || !ingredients || !category_id){
            return res.status(404).json({ "message": "upload photo failed" });
        }
        console.log(imageCloud) 
        let users_id = req.payload.id
        console.log('payload')
        console.log(req.payload)
        if(!title || !ingredients || !category_id){
            return res.status(404).json({ "message": "input title ingredients category required" });
        }
        let data = {
            title: title,
            ingredients : ingredients,
            category_id : parseInt(category_id),
            users_id,
            photo : imageCloud.secure_url
        }
        console.log("data")
        console.log(data)
        let result = postRecipe(data)
        console.log(result)
        return res.status(200).json({"status":200,"message":"data recipe success",data})
    },
    putData: async (req, res, next) => {
        const { id } = req.params
        const { title, ingredients, category_id } = req.body

        if (!id || id <= 0 || isNaN(id)) {
            return res.status(404).json({ "message": "id wrong" });
        }


        let dataRecipeId = await getRecipeById(parseInt(id))
        let users_id = req.payload.id

        //photo chek
        if (!req.file) {
            console.log('id data')
            console.log(users_id)
            console.log(dataRecipeId.rows[0].users_id)
            if (users_id != dataRecipeId.rows[0].users_id) {
                return res.status(404).json({ "message": "recipe bukan milik anda" });
            }
    
            console.log("put data")
            console.log(dataRecipeId.rows[0])
    
            let data = {
                title: title || dataRecipeId.rows[0].title,
                ingredients: ingredients || dataRecipeId.rows[0].ingredients,
                category_id: parseInt(category_id) || dataRecipeId.rows[0].category_id,
                photo: dataRecipeId.rows[0].photo
            }
    
            let result = putRecipe(data, id)
            console.log(result)

            delete data.id
            return res.status(200).json({ "status": 200, "message": "update data recipe success", data })
        }else{
            // if(!req.isFileValid){
            //     return res.status(404).json({ "message": req.isFileValidMessage });
            // }
            
            const ImageCloud = await cloudinary.uploader.upload(req.file.path, { folder: 'recipe' });

            if (!ImageCloud) {
                return res.status(404).json({ "message": "upload photo fail" });
            }
            // console.log(ImageCloud)
            // console.log('id data')
            // console.log(users_id)
            // console.log(dataRecipeId.rows[0].users_id)
            if (users_id != dataRecipeId.rows[0].users_id) {
                return res.status(404).json({ "message": "recipe bukan milik anda" });
            }
    
            console.log("put data")
            console.log(dataRecipeId.rows[0])
    
            let data = {
                title: title || dataRecipeId.rows[0].title,
                ingredients: ingredients || dataRecipeId.rows[0].ingredients,
                category_id: parseInt(category_id) || dataRecipeId.rows[0].category_id,
                photo:ImageCloud.secure_url
            }
    
            let result = putRecipe(data, id)
            console.log(result)

            delete data.id
            return res.status(200).json({ "status": 200, "message": "update data recipe success", data })
        }
    
    },
    getDataDetail: async (req,res,next) =>{
        const {search,searchBy,limit,sort} = req.query
        let page = req.query.page || 1
        let limiter = limit || 5
       
        data = {
            search: search || '',
            searchBy: searchBy || 'title',
            sort: sort,
            offset : (page - 1) * limiter,
            limit: limit || 5
    }
    let dataRecipe = await getRecipe(data)
    let dataRecipeCount = await getRecipeCount(data)
    let pagination = {
        totalPage: Math.ceil(dataRecipeCount.rows[0].count/limiter),
        totalData: parseInt(dataRecipeCount.rows[0].count),
        pageNow: parseInt(page)
    }

    console.log("datarecipe")
    console.log(dataRecipe)
    console.log("total data")
    console.log(dataRecipeCount.rows[0].count)
    if(dataRecipe){
        res.status(200).json({"status":200,"message":"get data recipe succes",data:dataRecipe.rows,pagination})
    }
    }
}

module.exports = RecipeController