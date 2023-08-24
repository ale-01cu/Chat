import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {addUsername} from '../redux/tokensSlice'
import SendArrow from '../assets/send_FILL1_wght400_GRAD0_opsz24.svg'

var chatSocket = null

function Chat() {
  const [usersOnline, setUsersOnline] = useState([])
  const [messages, setMessages] = useState([]) // 0 el local y 1 el externo
  const [prompt, setPrompt] = useState('')
  const accesToken = useSelector(s => s.tokens.access)
  const username = useSelector(s => s.tokens.username)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!username) {
      const username = localStorage.getItem('username')
      dispatch(addUsername(username))
    }
  

  }, [dispatch, username])

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
    
    if (accesToken) {
      if (!chatSocket) {
        chatSocket = new WebSocket(
          'ws://'
          + 'localhost:8000'
          + '/ws/chat/'
          + 'evento_almejas'
          + '/?token=' + accesToken
        );

      }

      chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(data);

        if (data.users) {
          setUsersOnline(data.users)

        } else if (typeof data.message.length == 'number'){
          console.log({"antes del save": data.message});
          setMessages(data.message)
          console.log({"despues del save": messages});

        } else {
          setMessages([
            ...messages, 
            data.message
          ])

        }
      };

      const reConnect = () => {
        try {
          chatSocket = new WebSocket(
              'ws://'
              + 'localhost:8000'
              + '/ws/chat/'
              + 'evento_almejas'
              + '/?token=' + accesToken
            );
        } catch {
          reConnect() 
        }
      }
    
      chatSocket.onopen = () => {
        console.log('Conexion establecida con el servidor...');
      }

      chatSocket.onclose = function() {
        console.error('Chat socket closed unexpectedly');
        reConnect()

      }
    
      chatSocket.onerror = function() {
        console.error('Chat socket error');
        // Intentar reconectar después de 5 segundos
      };

    }
  }, [messages, accesToken])
  

  const handleChange = (e) => {
    setPrompt(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(prompt);
    chatSocket.send(JSON.stringify({
      'message': prompt
    }));

    setPrompt('')
    window.scrollTo(0, document.body.scrollHeight);

  }

  
  return (
    <div id='container-chat' className='xl:px-32 flex min-h-screen w-full'>
      <div id='users-menu' className='relative flex'>
        <div id='sub-menu-fixed' className=' bg-zinc-950 fixed h-full top-0 p-3'>
          <ul className='p-3'> 
            {
              usersOnline.map(u => (
                <li key={u.id}>
                  <a href="" className='px-3 py-2 w-full text-white'>{u.username}</a>
                </li>
              ))
            }
          </ul>
        </div>

      </div>
      <div id='container' className='w-full bg-zinc-900 flex flex-col items-center'>
        <div id='conteiner-display-m'>
          <div id='display-m' className='h-full w-11/12 px-2 pr-4 flex flex-col gap-y-3'>
            {
              messages.length > 0 && messages.map(m => {
                console.log(username);
                console.log(m.presence.user.username);
                console.log(m.presence.user.username == username);
                return <div id='message' key={m.id} className={`text-white w-max pl-3 px-2 py-2 rounded-xl max-w ${m.presence.user.username == username ? 'self-end' : ''}`}>
                  {/* <span>{Object.keys(m)}</span> */}
                  <span>{m.presence.user.username}</span>
                  <p className='break-all'>{m.message}</p>
                </div>
              })
            }
          </div>

        </div>
        <div id='form-container' className='h-74 fixed bottom-0 bg-zinc-900'>
          <form action="" onSubmit={handleSubmit} className='px-2 py-1 flex gap-x-2'>
            <input id='inp-message' className='p-3 w-11/12 text-white rounded-xl' placeholder='Escriba un mensaje aqui' value={prompt} onChange={handleChange}></input>
            <button type="submit" name="" id="send" className='w-1/12 text-white rounded-full p-1 flex justify-center items-center'>
              <img src={SendArrow} alt="" width={27} height={27} className=''/>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
