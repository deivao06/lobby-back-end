import express from "express";
import { body, param, validationResult } from 'express-validator';
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import { UserController } from "../Controllers/UserController";

const app = express();
const userRouter = express.Router();

const authMiddleware: AuthMiddleware = new AuthMiddleware();
const userController: UserController = new UserController();

userRouter.post('/user',
    authMiddleware.verifyAuthToken,
    body('email').notEmpty().withMessage("Campo email obrigatório"),
    body('email').isEmail().withMessage("Campo mail deve ser um email válido"),
    body('username').notEmpty().withMessage("Campo nome de usuario obrigatório"),
    body('password').notEmpty().withMessage("Campo senha é obrigatório"),
    function(request, response) {
        const errors = validationResult(request);

        if(!errors.isEmpty()) {
            return response.status(400).json({ errors:errors.array() });
        }

        userController.createUser(request, response);
    }
);

userRouter.get('/user/:id',
    authMiddleware.verifyAuthToken,
    param('id').isInt().toInt().withMessage("ID deve ser um número inteiro"),
    param('id').exists().notEmpty().toInt().withMessage("ID obrigatório"),
    function(request, response) {
        const errors = validationResult(request);

        if(!errors.isEmpty()) {
            return response.status(400).json({ errors:errors.array() });
        }

        userController.getUserById(request, response);
    }
);

userRouter.patch('/user/:id',
    authMiddleware.verifyAuthToken,
    param('id').isInt().toInt().withMessage("ID deve ser um número inteiro"),
    param('id').exists().notEmpty().toInt().withMessage("ID obrigatório"),
    function(request, response) {
        const errors = validationResult(request);

        if(!errors.isEmpty()) {
            return response.status(400).json({ errors:errors.array() });
        }

        userController.updateUser(request, response);
    }
);

userRouter.delete('/user/:id',
    authMiddleware.verifyAuthToken,
    param('id').isInt().toInt().withMessage("ID deve ser um número inteiro"),
    param('id').exists().notEmpty().toInt().withMessage("ID obrigatório"),
    function(request, response) {
        const errors = validationResult(request);

        if(!errors.isEmpty()) {
            return response.status(400).json({ errors:errors.array() });
        }

        userController.deleteUser(request, response);
    }
);

userRouter.get('/users', authMiddleware.verifyAuthToken, function(request, response) {
    userController.getAllUsers(request, response)
});

export default userRouter;