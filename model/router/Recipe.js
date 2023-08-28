const {getData,getDataById,deleteDataById,postData,putData,getDataDetail} = require("../controller/RecipeController")
const express = require('express');
const { Router } = require("express");
const router = express.Router()
const {Protect} = require('./../midleware/Protect')
const upload = require("../midleware/UploadPhoto");


router.get('/',Protect,getData)
router.get('/detail',getDataDetail)
router.get('/:id',getDataById)
router.delete('/:id',Protect,deleteDataById)
router.post('/',Protect,upload.single('photo'),postData)
router.put('/:id',Protect,upload.single('photo'),putData)

module.exports = router;