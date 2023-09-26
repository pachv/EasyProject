const userService = require('../classes/userService');

const validator = require('express-validator')

const apiErrors = require('../exceptions/apiErrors')

class UserController {

    async registration(req,res,next) {
        try {


            // if eny validation error exist we throw bad request
            const errors = validator.validationResult(req)

            if (!errors.isEmpty()){
                return next(apiErrors.BadRequest("Ошибка регистрации", errors.array()))
            }

            // get email, password, first-secon-last name and adminToken from the body
            const {email,password,fslName,adminToken} = req.body


            // try to registrate user
            const userData = await userService.registration(email,password,fslName,adminToken)


            // add cookie to user
            res.cookie('refreshToken',userData.refreshToken,{
                maxage:30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req,res,next) {
        try {
            const {email,password} = req.body

            const userData = await userService.login(email,password)

            // add cookie to user
            res.cookie('refreshToken',userData.refreshToken,{
                maxage:30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req,res,next) {
        try {

            const {refreshToken} = req.cookies

            await userService.logout(refreshToken)

            res.clearCookie('refreshToken')

            return res.status(200).json({resp:"You loged out"})
        } catch (e) {
            next(e)
        }
    }


    async refresh(req,res,next) {
        try {
            // take the token
            const {refreshToken} = req.cookies

            // try to refresh it
            const userData = await userService.refresh(refreshToken)

            res.cookie('refreshToken',userData.refreshToken,{
                maxage:30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
            
        } catch (e) {
            next(e)
        }
    }


}

module.exports = new UserController()