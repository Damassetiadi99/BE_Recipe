const {getRecipe,getRecipeById,deleteById,postRecipe,putRecipe,getRecipeAll,getRecipeCount,getMyRecipe} = require('../model/RecipeModel')

const cloudinary = require ('../config/photo.js')


const RecipeController ={
    getData:async (req,res,next)=>{
        let dataRecipe = await getRecipeAll()
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


        if(!dataRecipeId.rows[0]){
            return res.status(200).json({"status":200,"message":"get data recipe not found",data:[]})
        }

        return res.status(200).json({"status":200,"message":"get data recipe success",data:dataRecipeId.rows[0]})
    },
    getMyRecipe : async (req, res) => {
        try {
          const { search, searchBy, limit, sort } = req.query;
          const {id} = req.payload;

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

            if (req.payload.id != dataRecipeId.rows[0].users_id) {
                return res.status(403).json({ message: "Recipe is not owned by you" });
              }
            let result = await deleteById(parseInt(id))

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
        const imageCloud = await cloudinary.uploader.upload(req.file.path,{folder : 'recipe'});
        if(!title || !ingredients || !category_id){
            return res.status(404).json({ "message": "upload photo failed" });
        }
        let users_id = req.payload.id
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
        let result = postRecipe(data)
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
            if (users_id != dataRecipeId.rows[0].users_id) {
                return res.status(404).json({ "message": "recipe bukan milik anda" });
            }
    
            let data = {
                title: title || dataRecipeId.rows[0].title,
                ingredients: ingredients || dataRecipeId.rows[0].ingredients,
                category_id: parseInt(category_id) || dataRecipeId.rows[0].category_id,
                photo: dataRecipeId.rows[0].photo
            }
    
            let result = putRecipe(data, id)

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
            if (users_id != dataRecipeId.rows[0].users_id) {
                return res.status(404).json({ "message": "recipe bukan milik anda" });
            }
    
            let data = {
                title: title || dataRecipeId.rows[0].title,
                ingredients: ingredients || dataRecipeId.rows[0].ingredients,
                category_id: parseInt(category_id) || dataRecipeId.rows[0].category_id,
                photo:ImageCloud.secure_url
            }
    
            let result = putRecipe(data, id)
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

    if(dataRecipe){
        res.status(200).json({"status":200,"message":"get data recipe succes",data:dataRecipe.rows,pagination})
    }
    }
}

module.exports = RecipeController