import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { query, body, param, validationResult, oneOf } from 'express-validator';
import { UserController } from "./app/Controllers/UserController";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();
const apiRouter = express.Router();

const userController = new UserController();

apiRouter.post('/user', 
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

apiRouter.get('/user/:id',
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

apiRouter.patch('/user/:id',
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

apiRouter.delete('/user/:id',
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

apiRouter.get('/users', function(request, response) {
    userController.getAllUsers(request, response)
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});