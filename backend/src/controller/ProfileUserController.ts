import { Request, Response } from 'express'
import { ProfileUserService } from '../services/ProfileUserService';


class ProfileUserController {
  async handle(request: Request, response: Response) {

    // Pega o id do usuário logado
    const { user_id } = request;
    // Intancia o serviço de profile
    const service = new ProfileUserService();
    // Executa o serviço
    const result = await service.execute(user_id);
    // Retorna o resultado
    return response.json(result);
    
  }
};

export { ProfileUserController }