const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const TokenService = require('./tokenService')
const yamlConfig = require('node-yaml-config')
const config = yamlConfig.load('./config/config.yaml')

const UserDTO = require('../dtos/usetDTO')
const tokenService = require('./tokenService')

const ApiError = require('../exceptions/apiErrors')
const userModel = require('../models/userModel')

class UserService {
    async registration (email,password,fslName,adminToken) {

        // look for the user in the database
        const candidate = await UserModel.findOne({email})

        // if the user exists, we throw an error
        if (candidate){
            throw ApiError.BadRequest("Пользователь существует")
        }

        // otherwise we hash his password
        const hashPassword = await bcrypt.hash(password,3)

        if (!adminToken) {

            if (adminToken != config.admin.admin_token) {
                return ApiError.BadRequest("Не верный token админа")
            }

            
            
        }

        const user = await UserModel.create({email:email,password:hashPassword,fslName:fslName})

        
    
        // throw an unnececary stuff, such as activation link by making dto
        const userDTO = new UserDTO(user)

        // then we generate access and refresh tokens
        // in this example we use dto that consist of email id and activation to generate tokens
        const tokens = TokenService.generateTokens({...userDTO})
    
        //so we save this user and his refresh token
        await tokenService.saveToken(userDTO.id,tokens.refreshToken)
    

        return {...tokens,user: userDTO}

    }
    
    async login(email,password) {


        // check if a user with such password exist
        const user = await userModel.findOne({email})

        if (!user) {
            throw ApiError.BadRequest("Пользователь не был найден")
        }

        // chesk if current password and passwlrd in db are equal
        const isPassEquals = await bcrypt.compare(password,user.password)

        if (!isPassEquals) {
            throw ApiError.BadRequest("Пароль не подходит")
        }

        const userDTO = new UserDTO(user)

        // throw an unnececary stuff by using DTO
        // then we generate access and refresh tokens
        // in this example we use dto  to generate tokens
        const tokens = TokenService.generateTokens({...userDTO})
    
        //so we save this user and his refresh token
        await tokenService.saveToken(userDTO.id,tokens.refreshToken)
    

        return {...tokens,user: userDTO}

    }

    async logout(refreshToken) {

        // remove tokens
         await tokenService.removeToken(refreshToken)

    }

    async refresh(refreshToken) {

        // check if current token exits
        if (!refreshToken) {
            throw ApiError.UnautherizedError()
        }

        //validate refreshTOke
        const isRefreshTokenValid = tokenService.validateRefreshToken(refreshToken)
        // look for this token in db
        const dbHasRefreshToken = tokenService.findRefreshTokenInDB(refreshToken)
        
        // if something went wrong throw unautherizedError
        if (!isRefreshTokenValid || !dbHasRefreshToken) {
            throw ApiError.UnautherizedError()
        }


        // find user
        const user = userModel.findById(isRefreshTokenValid.id)
        // and make dto
        const userDTO = new UserDTO(user)

        // generate new token with dto
        const tokens = TokenService.generateTokens({...userDTO})
    
        //so we save this user and his refresh token
        await tokenService.saveToken(userDTO.id,tokens.refreshToken)
    

        return {...tokens,user: userDTO}        
    }
}

module.exports = new UserService()