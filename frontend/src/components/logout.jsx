import { useDispatch } from 'react-redux';
import { addTokens } from '../redux/tokensSlice.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('tkaccess', '')
    localStorage.setItem('tkrefresh', '')

    dispatch(addTokens({
      access: '', 
      refresh: ''
    }))

    navigate('/')
  }, [dispatch, navigate])

  return null;

}

export default Logout