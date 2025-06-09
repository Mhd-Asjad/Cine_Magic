import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { X , AlertCircle , CheckCircle } from 'lucide-react'

export default function CustomAlert({ title, message, setMessage , isError ,  duration = 3000 }) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFadeOut(true), duration - 500);
    const remove = setTimeout(() => setShow(false), duration);
    return () => {
      clearTimeout(fade);
      clearTimeout(remove);
    };
  }, [duration]);

  if (!show) return null;

  return (
    <Alert
      variant={ isError ? 'destructive' : ''}
      className={`fixed top-10 right-4 w-full max-w-sm transition-all duration-500 ease-in-out transform ${
        fadeOut ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
        <div className='flex justify-end' >

            <X onClick={() => setMessage('')} />    

        </div>
        {isError ? <AlertCircle className="mt-4"/> : <CheckCircle className="mt-4"/>}
      <AlertTitle>{title || "Notice"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
