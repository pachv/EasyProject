const jwt = require('jsonwebtoken')
const yamlConfig = require('node-yaml-config')


const config = yamlConfig.load('./config/config.yaml')

const tokenModel = require('../models/tokenModel')

class TokenService {


    // payload is an information that has to be inside jwt token
    generateTokens(payload){

        // make tokens

        const accessToken = jwt.sign(payload,config.jwt.access_secret,
                                    {expiresIn:"30m"})

        const refreshToken = jwt.sign(payload,config.jwt.refresh_secret,
                                        {expiresIn:"30d"})

        return {
            accessToken,
            refreshToken
        }

    }

    async saveToken(userId,refreshToken) {

        // we check if the perosn with current userId has a reshresh token

        const tokenData = await tokenModel.findOne({
            user: userId
        })


        // if he does we save tokenData
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        // otherwise add user and it's token to tokenModel
        const token = await tokenModel.create({
            user : userId,
            refreshToken
        })

        return token
    }

    async validateAccessToken(token) {
        try {
            const isAccessTokenValid = jwt.verify(token,config.jwt.access_secret)
            return isAccessTokenValid
        } catch (e) {
            return null
        }
    }

    async validateRefreshToken(token) {
        try {
            const isRefreshTokenValid = jwt.verify(token,config.jwt.refresh_secret)
            return isRefreshTokenValid
        } catch (e) {
            return null
        }
    }

    async removeToken(refreshToken) {

        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData
    }

    async findRefreshTokenInDB(refreshToken) {
        const refreshTokenInDB = tokenModel.findOne({refreshToken})
        return refreshTokenInDB
    }
}

module.exports = new TokenService()