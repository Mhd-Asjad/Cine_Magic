import React , {useState} from 'react'
import apiAdmin from '../../Axios/api'
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN , REFRESH_TOKEN } from '../../constants';
function AdminLogin() {
  const [ username , setUsername] = useState('');
  const [ password , setPassword ] = useState('')
  const [ usernameError , setUsernameError   ] = useState(false)
  const navigate = useNavigate();
  const [error , setError] = useState('');


    const handleAdminLogin = async (e) => {
      e.preventDefault( )
      try {
        const response = await apiAdmin.post('admin/login/',
          {
            username,
            password
          })

          localStorage.setItem(ACCESS_TOKEN , response.data.access)
          localStorage.setItem(REFRESH_TOKEN , response.data.refresh)
          navigate('/admin/dashboard')
        
      }catch(error) {
        console.log(error)
        setError('invalid username or password')

      }
    };

    const handleUsernameBlur = () => {
        setUsernameError(username.trim() === '');
    }
    
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100' >
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className='text-2xl font-bold text-center mb-6' >Admin Login</h2>
        
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
                {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="max-w-md mx-auto p-4">
              <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                      Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onBlur={handleUsernameBlur}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 peer"
                    required
                  />
                  {
                    usernameError && (
                      <p className='mt-1 text-red-500 text sm' >*enter username</p>
                    )
                  }
                  
              </div>
              <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                      Password
                  </label>
                  <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 peer"
                      required
                      minLength="6"
                  />
                   {password.length > 0 && password.length < 6 && (
                        <p className="mt-1 text-sm text-red-500">Password must be at least 6 characters long.</p>
                    )}
              </div>
              
              <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                  Login
              </button>
          </form>

        </div>
    </div>
  )
}
export default AdminLogin
