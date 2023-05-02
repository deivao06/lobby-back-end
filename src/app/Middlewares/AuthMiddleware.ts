import * as dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

if (!process.env.TOKEN_SECRET) {
    process.exit(1);
}

var secret: jwt.Secret = process.env.TOKEN_SECRET;

export class AuthMiddleware {
    public verifyAuthToken(request: any, response: any, next: any) {
        var authToken = request.headers["authorization"];

        if(authToken){
            jwt.verify(authToken, secret, function(err: any, decoded: any) {
                if (err) {
                    return response.status(401).json({
                        errors: [
                            {msg: "Falha na autenticação, token inválido ou expirado"}
                        ]
                    })
                } else {
                    request.user = decoded.user;

                    next();
                }
            })
        } else {
            return response.status(401).json({
                errors: [
                    {msg: "Solicitação não autorizada"}
                ]
            })
        }
    }
}