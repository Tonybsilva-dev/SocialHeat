import styles from './styles.module.scss';
import logoImage from '../../assets/logo.svg'
import { api } from '../../services/api'
import io from 'socket.io-client'
import { useEffect, useState } from 'react';


type Message = {
  id: number;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

let messagesQueue: Message[] = []

const socket = io('http://localhost:4000')
socket.on('new_message', newMessage => {
  messagesQueue.push(newMessage);
})

export function MessageList() {

  const [messages, setMessages] = useState<Message[]>([]);
  console.log(messages);


  useEffect(() => {

    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages( prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean));

        messagesQueue.shift();
      }
    }, 1500)
  }, [])


  useEffect(() => {
    api.get<Message[]>('messages/last3').then(response => {
      setMessages(response.data);
    })
  }, [])


  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImage} alt="DoWhile 2021" />
      <ul className={styles.messageList}>
        {messages.map(message => {
          return (
            <li key={message.id} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>
                <span>{message.user.name}</span>
              </div>
            </li>
          )
        })}

      </ul>
    </div>
  )
}