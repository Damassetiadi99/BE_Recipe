const app = require("express")
const router = app.Router()
const Recipe = require("./Recipe")
const Category = require("./Category")
const Users = require("./Users")


router.use('/recipe',Recipe)
router.use('/category',Category)
router.use('/users',Users)

module.exports = router;