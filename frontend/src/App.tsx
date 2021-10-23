import { useContext } from 'react'
import { LoginBox } from './components/LoginBox'
import { MessageList } from './components/MessageList'
import { SendMessageForm } from './components/SendMessageFom'
import { AuthContext } from './context/auth'
import styles from './styles/App.module.scss'

export function App() {

  const { user } = useContext(AuthContext);


  return (
    <main className={styles.contentWrapper}>
      <MessageList />
      {!!user ? <SendMessageForm /> : <LoginBox /> }
    </main>
  )
}