import { Router } from 'express';
import { AuthenticateUserController } from '../controller/AuthenticateUserController';

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

router.post('/authenticate', new AuthenticateUserController().handle)

export { router }