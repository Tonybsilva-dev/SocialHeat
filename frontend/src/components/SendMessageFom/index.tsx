import { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../context/auth';
import { api } from '../../services/api';
import styles from './styles.module.scss';

export function SendMessageForm() {
  const { user, singOut } = useContext(AuthContext);
  const [message, setMessage] = useState('');




  async function handleSendMensage(event: FormEvent) {

    // Previne o recarregamento da página junto ao envio do formulário
    event.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    await api.post('/messages', { message })

    setMessage('');
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.singOutButton} onClick={singOut} >
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size={16} />
          {user?.login}
        </span>
      </header>

      <form onSubmit={handleSendMensage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Deixe aqui a sua mensagem" />
        <button className={styles.submitButton} type="submit">Enviar Mensagem</button>
      </form>
    </div>
  )
}