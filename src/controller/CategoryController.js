const {getCategory,deleteUserById,postCategory,getCategoryById,putCategory} = require('../model/CategoryModel')

const CategoryController = {
    getData: async (req,res,next)=>{
        let data = await getCategory()
        if(data){
            res.status(200).json({"status":200,"message":"get data category success",data:data.rows})
        }
    },
    deleteCategoryById: async(req,res,next)=>{
        try{
            const {id} = req.params

            if(!id || id <= 0 || isNaN(id)){
                return res.status(404).json({ "message": "id wrong" });
            }
            
            let result = await deleteUserById(parseInt(id))
            if(result.rowCount==0){
                throw new Error("delete data failed")
            }
            return res.status(200).json({"status":200,"message":"delete data Category success",data:result.rows[0]})

        } catch(err){
            return res.status(404).json({"status":404,"message":err.message})
        }
    },
    postDataCategory: async(req,res,next)=>{
        const{name} = req.body
        if(!name){
            return res.status(404).json({ "message": "input name required" });
        }
        let data = {
            name: name
        }

        let result = postCategory(data)
        return res.status(200).json({"status":200,"message":"data Category success",data})

    },
    putDataCategory:async(req,res,next)=>{
        const {id} = req.params
        const{name} = req.body

        if(!id || id <= 0 || isNaN(id)){
            return res.status(404).json({ "message": "id wrong" });
        }

        let dataCategoryId = await getCategoryById(parseInt(id))

        let data = {
            name: name || dataCategoryId.rows[0].name,
            id
        }

        let result = putCategory(data,id)
        delete data.id

        return res.status(200).json({"status":200,"message":"update data Category success",data})

    },
    getDataCategoryById: async (req,res,next) => {
        const {id} = req.params

        if(!id || id <= 0 || isNaN(id)){
            return res.status(404).json({ "message": "id wrong" });
        }

        let dataCategoryId = await getCategoryById(parseInt(id))

        if(!dataCategoryId.rows[0]){
            return res.status(200).json({"status":200,"message":"get data Category not found",data:[]})
        }

        return res.status(200).json({"status":200,"message":"get data Category success",data:dataCategoryId.rows[0]})
    }
}

module.exports = CategoryController