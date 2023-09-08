const {getData,getDataById,deleteDataById,postData,putData,getDataDetail,getMyRecipe} = require("../controller/RecipeController")
const express = require('express');
const {Router} = require("express");
const router = express.Router()
const {Protect} = require('./../midleware/Protect')
const upload = require("../midleware/UploadPhoto");


router.get('/',Protect,getData)
router.get('/detail',getDataDetail)
router.get('/:id',getDataById)
router.get('/myRecipe/coba',Protect,getMyRecipe)
router.delete('/:id',Protect,deleteDataById)
router.post('/recipe',Protect,upload.single('photo'),postData)
router.put('/putRecipe/id',Protect,upload.single('photo'),putData)

module.exports = router;