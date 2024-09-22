import User from '../../model/user'
import { IUser, AuthenticatedRequest } from '../../interface/user'
import userSchema from '../../schema/auth'
import { Response, NextFunction } from 'express'
import { createError } from '../../utils/errorUtils'
import { ErrorResponse } from '../../middleware/errorMiddleware'

const signup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { name, email, } = req.body as IUser

    interface IBodySignup extends IUser {
        confirmPassword?: string
    }

    let errResponse: ErrorResponse
    const { error } = userSchema.validate(req.body, { abortEarly: false })
    if (error) {
        errResponse = createError('Validation Error', 400, error.details.map(err => err.message))
        return next(errResponse)
    }

    try {
        let duplicate_err_message: string[] = []
        const userNameExists = await User.findOne({ name });
        userNameExists && duplicate_err_message.push("userName đã tồn tại")

        const emailExists = await User.findOne({ email });
        emailExists && duplicate_err_message.push("Email đã tồn tại")
        if (duplicate_err_message.length) {
            errResponse = createError("Duplicate", 400, duplicate_err_message)
            return next(errResponse)
        }

        await User.create({
            ...req.body,
            confirmPassword: undefined
        } as IBodySignup)

        return res.status(200).json({
            message: 'Signup success'
        })
    } catch (error) {
        next(error)
    }
}

export default signup