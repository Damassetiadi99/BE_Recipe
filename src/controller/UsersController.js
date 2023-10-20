const { getUser, getUsersById, deleteUserById, postUser, putUser, getUserAll, getUserCount, getUsersByEmail, createUser } = require('../model/UsersModel')
const argon2 = require('argon2');
const {GenerateToken} = require('../helpers/GenerateToken');
const cloudinary = require('../config/photo')

const UsersController = {
    getDataUsers: async (req, res, next) => {
        let data = await getUserAll()
        if (data) {
            res.status(200).json({ "status": 200, "message": "get data Users success", data: data.rows })
        }
    },
    getDataUserById: async (req, res, next) => {
        const { id } = req.params

        if (!id || id <= 0 || isNaN(id)) {
            return res.status(404).json({ "message": "id wrong" });
        }

        let dataUsersId = await getUsersById(parseInt(id))

        console.log("dataUser")
        console.log(dataUsersId)

        if (!dataUsersId.rows[0]) {
            return res.status(200).json({ "status": 200, "message": "get data Users not found", data: [] })
        }

        return res.status(200).json({ "status": 200, "message": "get data Users success", data: dataUsersId.rows[0] })
    },
    deleteDataUserById: async (req, res, next) => {
        try {
            const { id } = req.params

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ "message": "id wrong" });
            }

            let result = await deleteUserById(parseInt(id))
            console.log(result)
            if (result.rowCount == 0) {
                throw new Error("delete data failed")
            }
            return res.status(200).json({ "status": 200, "message": "delete data users success", data: result.rows[0] })

        } catch (err) {
            return res.status(404).json({ "status": 404, "message": err.message })
        }
    },
    postDataUser: async (req, res, next) => {
        const { name, email } = req.body
        console.log("post data ")
        console.log(name, email)

        if (!name || !email) {
            return res.status(404).json({ "message": "input name and email required" });
        }
        let data = {
            name: name,
            email: email

        }

        console.log("data")
        console.log(data)
        let result = postUser(data)
        console.log(result)

        return res.status(200).json({ "status": 200, "message": "data users success", data })

    },
    // putDataUser: async (req, res, next) => {
    //     const { id } = req.params
    //     const { name, email } = req.body

    //     if (!id || id <= 0 || isNaN(id)) {
    //         return res.status(404).json({ "message": "id wrong" });
    //     }

    //     let dataUsersId = await getUsersById(parseInt(id))

    //     console.log("put data")
    //     console.log(dataUsersId.rows[0])

    //     let data = {
    //         name: name || dataUsersId.rows[0].name,
    //         email: email || dataUsersId.rows[0].email,
    //         id
    //     }

    //     let result = putUser(data, id)
    //     console.log(result)

    //     delete data.id

    //     return res.status(200).json({ "status": 200, "message": "update data Users success", data })

    // },
    putData: async (req, res, next) => {
        const { id } = req.params
        const { name, email, password } = req.body
        const image = req.file
        try {
            const current_user_id = req.user.id
            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ "message": "id wrong" });
            }
            
            let dataUsersId = await getUsersById(parseInt(id))
            if (dataUsersId.rowCount === 0) {
                return res.status(404).json({ "status": 404, "message": "The data you tried to update is not found in the database" });
            }
            if (current_user_id !== dataUsersId.rows[0].id) {
                return res.status(404).json({ "message": "akun ini bukan milik anda" });
            }
            console.log(id)
                console.log(req.params)
                console.log(req.user.id)
                console.log(current_user_id)
                console.log(dataUsersId.rows[0].id)
            
            const passwordHashed = password ? await argon2.hash(password) : password
            
            const hasilImage = image ? await cloudinary.uploader.upload(image.path, {
                use_filename: true,
                folder: "file-upload",
            }) : { secure_url: '' };

            let data = {
                name: name || dataUsersId.rows[0].name,
                email: email || dataUsersId.rows[0].email,
                password: passwordHashed || dataUsersId.rows[0].password,
                image: hasilImage.secure_url || dataUsersId.rows[0].photo,
            }

            let result = await putUser(data, id)
            console.log(data)

            return res.status(200).json({ "status": 200, "message": "update data users success" })
        } catch (err) {
            return res.status(404).json({ "status": 404, "message": err.message })

        }

    },
    getDataUserDetail: async (req, res, next) => {
        const { search, searchBy, limit, sort } = req.query

        let page = req.query.page || 1
        let limiter = limit || 5

        data = {
            search: search || '',
            searchBy: searchBy || 'name',
            sort: sort,
            offset: (page - 1) * limiter,
            limit: limit || 5

        }
        let dataUser = await getUser(data)
        let dataUserCount = await getUserCount(data)

        let pagination = {
            totalPage: Math.ceil(dataUserCount.rows[0].count / limiter),
            totalData: parseInt(dataUserCount.rows[0].count),
            pageNow: parseInt(page)
        }

        console.log("datarecipe")
        console.log(dataUser)
        console.log("total data")
        console.log(dataUserCount.rows[0].count)
        if (dataUser) {
            res.status(200).json({ "status": 200, "message": "get data user succes", data: dataUser.rows, pagination })
        }
    },
    login: async (req, res, next) => {
        let { email, password } = req.body
        console.log(email, password)

        if (!email || !password) {
            return res.status(404).json({ "status": 404, "message": "email atau password harus diisi dengan benar" })
        }

        let data = await getUsersByEmail(email)
        console.log(data.rows[0])

        if (!data.rows[0]) {
            return res.status(404).json({ "status": 404, "message": "email belum terdaftar" })
        }

        let users = data.rows[0]
        console.log('users.password')
        console.log(users.password)
        let verify = await argon2.verify(users.password, password)
        if (!verify) {
            return res.status(404).json({ "status": 404, "message": "password salah" })
        }
        delete users.password
        let token = GenerateToken(users)
        users.token = token

        res.status(200).json({ "status": 200, "message": "get data profile success", users })
    },
    register: async (req, res, next) => {
        let { email, password, username} = req.body
    
        if (!email || !password || !username) {
            return res.status(404).json({ "status": 404, "message": "email, password dan username harus diisi dengan benar" })
        }
        let user = await getUsersByEmail(email)

        if (user.rows[0]) {
            return res.status(401).json({ "status": 401, "message": "email sudah terdaftar, silahkan masukan email lain" })
        }
        password = await argon2.hash(password);
        
        


        let dataUser = {
            email, username, password 
        }
        console.log('dataUser')
        console.log(dataUser)



        let data = await createUser(dataUser)
        console.log('dataUsers1')
        // console.log(dataUser)
        console.log(data)

        if (!data.rowCount == 1) {
            return res.status(404).json({ "status": 404, "message": "register gagal" })
        }

        return res.status(200).json({ "status": 200, "message": "register user berhasil" })


    }
}

module.exports = UsersController