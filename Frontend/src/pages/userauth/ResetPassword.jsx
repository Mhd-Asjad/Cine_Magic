import React ,{useState} from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import userApi from '@/axios/userApi';
import CustomAlert from '@/components/CustomAlert';
import { CircleChevronLeft } from 'lucide-react';

function ResetPassword({ handleResetForm }) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (password !== confirm){
        setError('password does not match');
        return;
    }
    try {
        const res = await userApi.post('reset-password/', {
            'identifier' : emailOrUsername ,
            'password' : password
        })

        if (res.status === 200) {
            handleResetForm()
            setMessage('paswword updated successfully')
        }
    }catch(error){
        setError(error?.response?.data?.error)
        console.log(error)
    }
  }

  return (
    <div>

      <CircleChevronLeft size={28} className='ml-4 cursor-pointer w-[10%]' onClick={handleResetForm} />
      {message &&
        <CustomAlert setMessage={setMessage} message={message} isError={false} title={'verified'}  alert />
      }

      <div className="flex justify-center items-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="identifier">Email or Username</Label>
                <Input
                  id="identifier"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              <div className='flex justify-center' >

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              </div>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default ResetPassword
