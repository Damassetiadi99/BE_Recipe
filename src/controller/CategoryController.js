const {getCategory,deleteUserById,postCategory,getCategoryById,putCategory} = require('../model2/CategoryModel')

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
            console.log(result)
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
        console.log("post data ")
        console.log(name)
    
        if(!name){
            return res.status(404).json({ "message": "input name required" });
        }
        let data = {
            name: name
        }

        console.log("data")
        console.log(data)
        let result = postCategory(data)
        console.log(result)

        return res.status(200).json({"status":200,"message":"data Category success",data})

    },
    putDataCategory:async(req,res,next)=>{
        const {id} = req.params
        const{name} = req.body

        if(!id || id <= 0 || isNaN(id)){
            return res.status(404).json({ "message": "id wrong" });
        }

        let dataCategoryId = await getCategoryById(parseInt(id))

        console.log("put data")
        console.log(dataCategoryId.rows[0])

        let data = {
            name: name || dataCategoryId.rows[0].name,
            id
        }

        let result = putCategory(data,id)
        console.log(result)

        delete data.id

        return res.status(200).json({"status":200,"message":"update data Category success",data})

    },
    getDataCategoryById: async (req,res,next) => {
        const {id} = req.params

        if(!id || id <= 0 || isNaN(id)){
            return res.status(404).json({ "message": "id wrong" });
        }

        let dataCategoryId = await getCategoryById(parseInt(id))

        console.log("dataCategory")
        console.log(dataCategoryId)

        if(!dataCategoryId.rows[0]){
            return res.status(200).json({"status":200,"message":"get data Category not found",data:[]})
        }

        return res.status(200).json({"status":200,"message":"get data Category success",data:dataCategoryId.rows[0]})
    }
}

module.exports = CategoryController