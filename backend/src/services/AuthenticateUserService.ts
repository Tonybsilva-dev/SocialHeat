/* 
1. Receber o código.
2. Recuperar o access_token do github.
3. Recuperar info do user no github.
4. Verfificar se o usuário existe no DB.
--- SIM = Gera um Token
--- NAO = Cria um usuario, Gera um token
5. Retorna o token com as info do user.
*/

import axios from 'axios'
import { prismaClient } from '../prisma';
import { sign } from 'jsonwebtoken'

interface IAxiosTokenResponse {
  access_token: string
}

interface IUserResponse {
  avatar_url: string,
  login: string,
  id: number,
  name: string
}

class AuthenticateUserService {

  async execute(code: string) {

    const url = 'https://github.com/login/oauth/access_token';

    const { data: accessTokenResponse } = await axios.post<IAxiosTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code

      },
      headers: {
        "Accept": "application/json"
      }
    });

    const response = await axios.get<IUserResponse>('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    });


    // Verificamos se ja existe esse usuario no DB
    const { login, id, avatar_url, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    if (!user) {
      await prismaClient.user.create({
        data: {
          github_id: id,
          login: login,
          avatar_url: avatar_url,
          name: name
        }
      })
    }


    const token = sign({
      user: {
        name: user.name,
        avatar_url: user.avatar_url,
        id: user.github_id
      }
    },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '1d'
      }
    )


    return { token, user };

  }

}

export { AuthenticateUserService }