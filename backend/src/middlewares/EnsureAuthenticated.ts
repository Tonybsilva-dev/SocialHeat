import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayLoad {
  sub: string
}


export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    
  // Pegamos o token
  const authToken = request.headers.authorization;

  // Verificamos se o token existe
  if(!authToken) {
    return response.status(401).json({ error: '❌ JWT token is missing' });
  }

  // Tiramos o Bearer do token
  const [, token] = authToken.split(' ');

  try {
    // Através do Subject do token, verificamos se o token é válido
    const { sub } = verify( token, process.env.JWT_SECRET ) as IPayLoad;

    // Se o token for válido, atribuimos o id do usuário ao request
    request.user_id = sub;

    // Continuamos o fluxo
    return next();

  } catch (error) {
    return response.status(401).json({ error: '❌ JWT token is expired' });

  }
}