const ApiError = require('../exceptions/apiErrors')

const tokenService = require('../classes/tokenService')

module.exports = function (req,res,next) {
    try {

        // take header . the header must be called Berer TOKEN
        const authorizationHeader = req.headers.authorization

        // if token doesn't exit we throw and auth error
        if (!authorizationHeader) {
            return next(ApiError.UnautherizedError())
        }

        // as the token consist of two parts we take the secold
        accessToken = authorizationHeader.split(" ")[1]

        // if there is no second part, we throw an auth error
        if (!accessToken) {
            return next(ApiError.UnautherizedError())
        }

        // then we validate token
        const userData = tokenService.validateAccessToken(accessToken)
    
        // if it isn't validated well we throw an error
        if (!userData) {
            return next(ApiError.UnautherizedError())
        }

        // and add userData to user
        res.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnautherizedError())
    }
}