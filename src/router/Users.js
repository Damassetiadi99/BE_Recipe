const {getDataUsers,getDataUserById,deleteDataUserById,postDataUser,putDataUser,getDataUserDetail,login,register} = require("../controller/UsersController")
const express = require('express');
const { Router } = require("express");
const router = express.Router()
const multer = require('../midleware/UploadPhoto')



router.get('/getUser',getDataUsers)
router.get('/detail',getDataUserDetail)
router.get('/:id',getDataUserById)
router.delete('/:id',deleteDataUserById)
router.post('/',postDataUser)
router.post('/login',login)
router.post('/register',multer.single('photo'),register)
router.put('/putUser/:id',putDataUser)



module.exports = router;