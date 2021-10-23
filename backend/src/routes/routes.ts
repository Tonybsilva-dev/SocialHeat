import { Router } from 'express';
import { AuthenticateUserController } from '../controller/AuthenticateUserController';
import { CreateMessageController } from '../controller/CreateMessageController';
import { GetLast3MessagesController } from '../controller/GetLast3MessagesController';
import { ProfileUserController } from '../controller/ProfileUserController';
import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated';

const router = Router();


// Rota para login com o github
router.get('/github', (request, response) => {
  response.redirect(`http://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})

// Rota de callback que retorna o código de auth do usuario
router.get('/signin/callback', (request, response) => {

  const { code } = request.query;

  return response.json(code);

})

// Rota de Autenticação
router.post('/authenticate', new AuthenticateUserController().handle)

// Rota de Envio de Mensagens
router.post('/messages', ensureAuthenticated, new CreateMessageController().handle)

// Rota de Busca de Mensagens
router.get('/messages/last3', new GetLast3MessagesController().handle)

// Rota de Perfil do Usuario
router.get('/profile', ensureAuthenticated, new ProfileUserController().handle);

export { router }