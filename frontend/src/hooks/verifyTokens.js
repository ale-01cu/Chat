import { useEffect } from 'react';
import { VERIFYTOKENURL, REFRESHTOKENURL } from "../apis/endpoints"
import { useDispatch } from "react-redux"
import { addTokens } from "../redux/tokensSlice"
import { useNavigate } from 'react-router-dom';

const VerifyTokens = () => {
  const dispatch = useDispatch()
  const navegate = useNavigate()

  useEffect(() => {
    const tokenAccess = localStorage.getItem('tkaccess')
    const tokenRefresh = localStorage.getItem('tkrefresh')

    const verify = async () => {
      if (tokenAccess && tokenRefresh) {
        const res = await fetch(VERIFYTOKENURL, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({token: tokenAccess})
        })


        if (res.status === 200) {
          dispatch(addTokens({
            access: tokenAccess, 
            refresh: tokenRefresh
          }))
          navegate('chat')
          
        } else {
          const resRefresh = await fetch(REFRESHTOKENURL, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({refresh: tokenRefresh})
          })
          const { access, refresh } = await resRefresh.json()

          if (res.status === 200) {
            localStorage.setItem('tkaccess', access)
            localStorage.setItem('tkrefresh', refresh)

            dispatch(addTokens({
              access, 
              refresh
            }))
            navegate('chat')

          } else {
            localStorage.setItem('tkaccess', '')
            localStorage.setItem('tkrefresh', '')

            dispatch(addTokens({
              access: '', 
              refresh: ''
            }))
            navegate('/')
          }
        }
      }
    }

    if (!tokenAccess && !tokenRefresh) {
      navegate('/')
    
    }else {
      verify();
      
    }

  }, [dispatch, navegate])

  return null;
}

export default VerifyTokens;