import { Request, Response } from 'express'
import { CreateMessageService } from '../services/CreateMessageService';


class CreateMessageController {
  async handle(request: Request, response: Response) {

    // Pega a messagem do corpo da requisição
    const { message } = request.body;
    // Pega o id do usuário logado
    const { user_id } = request;
    // Intancia o serviço de criação de mensagem
    const service = new CreateMessageService();
    // Executa o serviço
    const result = await service.execute(message, user_id);
    // Retorna o resultado
    return response.json(result);
  }
};

export { CreateMessageController }