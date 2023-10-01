import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom'
import {addUsername, addTokens} from '../redux/tokensSlice'
import SendArrow from '../assets/send_FILL1_wght400_GRAD0_opsz24.svg'
import Logout from '../assets/logout_FILL0_wght600_GRAD0_opsz24.svg'
import menuIcon from '../assets/menu_FILL0_wght300_GRAD0_opsz24.svg'
import closeIcon from '../assets/close_FILL0_wght300_GRAD0_opsz24.svg'

var chatSocket = null

function Chat() {
  const [usersOnline, setUsersOnline] = useState([])
  const [messages, setMessages] = useState([]) // 0 el local y 1 el externo
  const [prompt, setPrompt] = useState('')
  const [visibleMenu, setVisibleMenu] = useState(false)
  const accesToken = useSelector(s => s.tokens.access)
  const username = useSelector(s => s.tokens.username)
  const dispatch = useDispatch()
  const navegate = useNavigate()


  useEffect(() => {
      const Storageusername = localStorage.getItem('username')

      if (Storageusername)
        dispatch(addUsername(Storageusername))
  
  }, [dispatch, username])

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
    
    if (accesToken) {
      console.log("hay token");
      if (!chatSocket) {
        console.log("no hay socket");
        chatSocket = new WebSocket(
          'ws://'
          + 'localhost:8000'
          + '/ws/chat/'
          + 'evento_almejas'
          + '/?token=' + accesToken
        );
        console.log(chatSocket);
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

  const handleLogout = () => {
    localStorage.setItem('tkaccess', '')
    localStorage.setItem('tkrefresh', '')
    localStorage.setItem('username', '')
    dispatch(addTokens({
      access: '', 
      refresh: ''
    }))
    dispatch(addUsername(''))
    chatSocket = null
    navegate('/')
  }

  const handleMenu = () => {
    setVisibleMenu(!visibleMenu)
  }

  
  return (
    <div id='container-chat' className='
      xl:px-32 
      flex 
      min-h-screen
      w-full'>

      <div className='
        fixed 
        top-0
        m-2
        md:hidden'>
        <button 
          type='button' 
          onClick={handleMenu}
          className='
            p-2 
            rounded-3xl 
            flex 
            justify-center 
            items-center 
            hover:bg-slate-900
            bg-slate-950
            transition-all'>
          <img src={menuIcon} alt="Menu" />
        </button>
      </div>

      <div id='users-menu-movil' 
        className={`
          fixed 
          left-0 
          top-0 
          w-full 
          bg-red-500 
          h-screen 
          z-50
          md:hidden
          transition-all 
          ${visibleMenu ? 'translate-x-0' : '-translate-x-full'}`}>

        <div 
          id='container-close-icon' 
          className='
            absolute 
            top-0 
            right-0
            p-2
            m-2'>
          <button 
            id='btn-close-icon' 
            type='button'
            onClick={handleMenu}>

            <img src={closeIcon} alt="close" />
          </button>
        </div>

        <div id='sub-menu-fixed-movil' className='
          flex
          bg-zinc-950 
          h-full 
          p-3 
          flex-col
          justify-between
          '>
          <ul className='p-3 space-y-5'> 
            {
              usersOnline.map(u => (

                <li key={u.id}>
                  <Link className='
                    flex 
                    items-center 
                    space-x-4
                  '>
                    <img 
                      src={"http://localhost:8000" + u.photo} 
                      alt=""
                      className='
                        w-10 
                        h-10 
                        rounded-full
                      '/>
                    <div className='
                      font-medium 
                      dark:text-white
                    '>
                        <div>{u.username}</div>
                        <div className='
                          text-sm 
                          text-gray-500 
                          dark:text-gray-400
                        '>Online</div>
                    </div>
                  </Link>
                </li>
              ))
            }
          </ul>

          <button 
            onClick={handleLogout} 
            type="button"
            className='
              px-5 
              py-2.5 
              text-sm 
              font-medium 
              text-white 
              inline-flex 
              items-center 
              bg-blue-700 
              hover:bg-blue-800 
              focus:ring-4 
              focus:outline-none 
              focus:ring-blue-300 
              rounded-lg text-center 
              dark:bg-blue-600 
              dark:hover:bg-blue-700 
              dark:focus:ring-blue-800
            '>
            <img src={Logout} alt=""/>
            Cerrar Sesión
          </button>
        </div>

      </div>

      <div id='users-menu' className='relative md:flex hidden'>
        <div id='sub-menu-fixed' className=' 
          bg-zinc-950 
          fixed 
          h-full 
          top-0 
          p-3 
          flex 
          flex-col 
          justify-between'>
          <ul className='p-3 space-y-5'> 
            {
              usersOnline.map(u => (

                <li key={u.id}>
                  <Link className="flex items-center space-x-4">
                    <img className="w-10 h-10 rounded-full" src={"http://localhost:8000" + u.photo} alt=""/>
                    <div className="font-medium dark:text-white">
                        <div>{u.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Online</div>
                    </div>
                  </Link>
                </li>
              ))
            }
          </ul>

          <button onClick={handleLogout} type="button" className="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <img src={Logout} alt=""  className='text-white mr-2'/>
            Cerrar Sesión
          </button>
        </div>

      </div>

      <div id='container' className='
        w-full 
        bg-zinc-900 
        md:flex 
        md:flex-col 
        md:items-center'>
        <div id='conteiner-display-m' className='h-full mb-20 mt-2'>
          <div id='display-m' className='
            h-full 
            flex 
            flex-col
            px-6
            lg:w-11/12 
            lg:px-2
            lg:pl-5 
            lg:pr-7 
            gap-y-3'>
            {
              messages.length > 0 && messages.map(m => {
                return <div id='message' key={m.id} className={`
                  text-white 
                  w-max 
                  pl-3 
                  px-2 
                  py-2 
                  rounded-xl 
                  max-w 
                  ${m.presence.user.username == username ? 'self-end' : ''}`}>
                  {/* <span>{Object.keys(m)}</span> */}
                  {
                    m.presence.user.username == username
                    ? null
                    : <Link to={"#"} className='text-slate-400'>{m.presence.user.username}</Link>
                  }
                  <p className='break-all'>{m.message}</p>
                </div>
              })
            }
          </div>

        </div>
        <div id='form-container' className='
          w-full
          md:w-auto
          h-74 
          fixed 
          bottom-0 
          bg-zinc-900'>
          <form action="" onSubmit={handleSubmit} className='
            px-5 
            py-1 
            flex 
            gap-x-2'>
            <input id='inp-message' className='
                p-3
                w-full 
                md:w-11/12
                text-white 
                rounded-xl' 
              placeholder='Escriba un mensaje aqui' 
              value={prompt} 
              onChange={handleChange}
              autoComplete={"false"}>
              
            </input>
            <button 
              type="submit" 
              name="" 
              id="send" 
              className='
                w-12
                lg:w-1/12 
                text-white 
                rounded-full 
                p-1 
                flex 
                justify-center 
                items-center'>
              <img src={SendArrow} alt="" width={27} height={27} className=''/>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
