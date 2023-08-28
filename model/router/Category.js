const {getData,deleteCategoryById,postDataCategory,putDataCategory,getDataCategoryById} = require("../controller/CategoryController")
const express = require('express');
const { Router } = require("express");
const router = express.Router()


router.get('/',getData)
router.get('/:id',getDataCategoryById)
router.delete('/:id',deleteCategoryById)
router.post('/',postDataCategory)
router.put('/:id',putDataCategory)


module.exports = router;