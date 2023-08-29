import {REGISTERURL} from '../apis/endpoints'
import { object, string } from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import Avatar from '../assets/avatar.svg'

const Register = () => {
  const [validationErrors, setValidationErrors] = useState({})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [re_password, setRePassword] = useState('')
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setUsername('')
      setPassword('')
      setRePassword('')
    }
  }, [])

  let registerSchema = object({
    username: string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(255, 'El nombre no debe tener más de 255 caracteres')
      .required('El nombre es obligatorio'),
    password: string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(255, 'La contraseña no debe tener más de 255 caracteres')
      .required('La contraseña es obligatoria'),
    re_password: string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(255, 'La contraseña no debe tener más de 255 caracteres')
      .required('La contraseña es obligatoria')
      .test('passwords-match', 'Las contraseñas no coinciden', function(value) {
        return password === value;
      })
  });

  const inputsValidate = (name, value) => {
    registerSchema.validateAt(name, { [name]: value })
      .then(() => {
        setValidationErrors(prevState => ({ ...prevState, [name]: null }));
      })
      .catch(error => {
        setValidationErrors(prevState => ({ ...prevState, [name]: error.message }));
      });

  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!validationErrors.username && !validationErrors.password && !validationErrors.re_password) {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('re_password', re_password);
      formData.append('photo', avatar);

      fetch(REGISTERURL,{
        method: "POST",
        body: formData
      })
      .then(res => {
        const getData = async () => res.json()

        getData().then(data => {

          if (res.status === 201) {
            navigate('/')

          }else {
            const errors = {}

            for (let i = 0; i < Object.keys(data).length; i++) {
              const key = Object.keys(data)[i];
              let value = data[key][0];

              if (value === 'The password is too similar to the Nombre de Usuario.')
                value = 'La contraseña es similar al nombre de usuario.'
              
              else if (value === 'This password is too common.')
                value = 'Esta contraseña es demasiado comun.'
              
              else if (value === 'Cuenta de Usuario with this Nombre de Usuario already exists.')
                value = 'Ya existe una cuenta con ese nombre.'

              else if (value === 'This field may not be blank.')
                value = 'Este campo no puede estar en blanco.'

              else if (value === "The two password fields didn't match.")
                value = 'Las contraseñas con diferentes.'

              else if (value === "Ensure this field has no more than 255 characters.")
                value = 'No estan permitidos mas de 255 caracteres.'

                errors[key] = value;
            }
            setValidationErrors(errors);
          }

        })
      })
      .catch(e => {
        console.log({error: e});
      })
    }
    
  }

  const handleChangeUserName = e => {
    const { name, value } = e.target
    inputsValidate(name, value)
    setUsername(value)
  }

  const handleChangePassword = e => {
    const { name, value } = e.target
    inputsValidate(name, value)
    setPassword(value)
  }

  const handleChangeRePassword = e => {
    const { name, value } = e.target
    inputsValidate(name, value)
    setRePassword(value)
  }

  const handleFileChange = (event) => {
    setAvatar(event.target.files[0]);
  };


  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Create and account
                  </h1>
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                      <div>
                        <label className="flex justify-center mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="photo">
                          <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                            {
                              avatar
                              ? <img src={URL.createObjectURL(avatar)} alt="" className='object-cover'/>
                              : <img src={Avatar} alt="" className='className="absolute w-12 h-12 -left-1"'/>
                            }
                            
                          </div>
                        </label>
                        <input 
                          className="
                          block 
                          w-full 
                          text-sm 
                          text-gray-900 
                          border 
                          border-gray-300 
                          rounded-lg cursor-pointer 
                          bg-gray-50 
                          dark:text-gray-400 
                          focus:outline-none 
                          dark:bg-gray-700 
                          dark:border-gray-600 
                          dark:placeholder-gray-400" 
                        id="file_input" 
                        type="file"
                        onChange={handleFileChange}
                      />
                      </div>
                      <div>
                          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Username</label>
                          <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            className="
                              bg-gray-50
                              border 
                              border-gray-300 
                              text-gray-900 
                              sm:text-sm 
                              rounded-lg 
                              focus:ring-primary-600 
                              focus:border-primary-600 
                              block w-full 
                              p-2.5 
                              dark:bg-gray-700 
                              dark:border-gray-600 
                              dark:placeholder-gray-400 
                              dark:text-white 
                              dark:focus:ring-blue-500 
                              dark:focus:border-blue-500" 
                            placeholder="Username" 
                            required
                            onChange={handleChangeUserName}
                            value={username}
                          />
                          {validationErrors.username && username && <span className="text-red-500 w-fit">{validationErrors.username}</span>}

                      </div>
                      <div>
                          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                          <input 
                            type='password'
                            name="password" 
                            id="password" 
                            placeholder="••••••••" 
                            className="
                              bg-gray-50 border 
                              border-gray-300 
                              text-gray-900 
                              sm:text-sm 
                              rounded-lg 
                              focus:ring-primary-600 
                              focus:border-primary-600 
                              block w-full 
                              p-2.5 
                              dark:bg-gray-700 
                              dark:border-gray-600 
                              dark:placeholder-gray-400 
                              dark:text-white 
                              dark:focus:ring-blue-500 
                              dark:focus:border-blue-500" 
                              required
                              onChange={handleChangePassword}
                              value={password}
                            />
                            {validationErrors.password && password && <span className="text-red-500 w-fit">{validationErrors.password}</span>}

                      </div>
                      <div>
                          <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                          <input 
                            type='password'
                            name="re_password" 
                            id="confirm-password" 
                            placeholder="••••••••" 
                            className="
                              bg-gray-50 border 
                              border-gray-300 
                              text-gray-900 
                              sm:text-sm 
                              rounded-lg 
                              focus:ring-primary-600 
                              focus:border-primary-600 
                              block 
                              w-full 
                              p-2.5 
                              dark:bg-gray-700 
                              dark:border-gray-600 
                              dark:placeholder-gray-400 
                              dark:text-white 
                              dark:focus:ring-blue-500 
                              dark:focus:border-blue-500" 
                            required
                            onChange={handleChangeRePassword}
                            value={re_password}
                          />

                          {validationErrors.re_password && re_password && <span className="text-red-500 w-fit">{validationErrors.re_password}</span>}
                          {validationErrors.non_field_errors && <span className="text-red-500 w-fit">{validationErrors.non_field_errors}</span>}

                      </div>
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input 
                              id="terms" 
                              aria-describedby="terms" 
                              type="checkbox" 
                              className="
                                w-4 
                                h-4 
                                border 
                                border-gray-300 
                                rounded 
                                bg-gray-50 
                                focus:ring-3 
                                focus:ring-primary-300 
                                dark:bg-gray-700 
                                dark:border-gray-600 
                                dark:focus:ring-primary-600 
                                dark:ring-offset-gray-800"
                                required
                              />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                              I accept the 
                              <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a>
                            </label>
                          </div>
                      </div>
                      <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                          Already have an account? 
                          <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                      </p>
                  </form>
              </div>
          </div>
      </div>
    </section>
  )
}

export default Register