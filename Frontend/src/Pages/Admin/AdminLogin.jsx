import React , {useState} from 'react'
import apiAdmin from '../../Axios/api'
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [ username , setUsername] = useState('');
  const [ password , setPassword ] = useState('')
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

          localStorage.setItem('token' , response.data.access)
          localStorage.setItem('refresh_token' , response.data.refresh)
          navigate('/dashboard')   

      }catch(error) {
        console.log(error)
        setError('invalid username or password')

      }
    };
    
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100' >
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className='text-2xl font-bold text-center mb-6' >Admin Login</h2>
        
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
                {error}
            </div>
          )}

        <form onSubmit={handleAdminLogin}>
          <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                  username
              </label>
              <input
            
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
              />
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
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
              />
          </div>
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
              Login
            </button>

        </form>
        </div>
    </div>
  )
}

export default AdminLogin
