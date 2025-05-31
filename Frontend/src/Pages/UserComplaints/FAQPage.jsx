import React, { useEffect, useState } from 'react'
import apiReview from '@/Axios/Reviewapi'
import Nav from '@/Components/Navbar/Nav'
import { FaCommentDots, FaTimes } from "react-icons/fa";
import ChatBotUi from './ChatBotUi';
import RaiseComplaint from './RaiseComplaint';

function FAQPage() {

    const [faqs , setFaqs ] = useState([])
    const [showCommonQuestions , setShowCommonQuestions ] = useState(false)
    const [raiseComplaintForm , setRaiseComplaintForm] = useState(false)
    const [isOpen, setIsOpen] = useState(false);

    const hanldeQns = () => {
        setShowCommonQuestions(prev => (!prev))
    }

    const handleComplaintForm = () => {
        setRaiseComplaintForm(state => (!state))
    }

    useEffect(() => {
        
        const fetchFaqs = async() => {
            try {
                const res = await apiReview.get('faqs/')
                setFaqs(res.data)
            }catch(e) {
                console.log(e)
            }
        }
        fetchFaqs()
    },[])
    console.log(faqs)
  return (
    <div className='bg-gray-50 min-h-screen' >
        <Nav />

        <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Help Center</h1>
        <div className="max-w-3xl mx-auto mt-[5%] bg-blend-soft-light space-y-4">
            <div 
                onClick={hanldeQns}
                className="flex gap-1 py-3 px-4 bg-gray-100 rounded shadow-sm hover:bg-gray-200 cursor-pointer"
            >
                Common Quesiton
            </div>
            {showCommonQuestions &&
            
                <div className="space-y-4">
                    {faqs.map(faq => (
                    <div key={faq.id} className="border p-4 rounded shadow-sm">
                        <h2 className="font-semibold">{faq.question}</h2>
                        <p className="text-gray-700">{faq.answer}</p>
                    </div>
                    ))}
                </div>
            
            }
        </div>

        <div 
            className="flex gap-1 py-3 px-4 bg-gray-100 rounded shadow-sm hover:bg-gray-200 cursor-pointer mt-4 "
            onClick={handleComplaintForm}
            
        >
            Submit issue

        </div>

        {raiseComplaintForm && 

            <div className="space-y-4 p-4 rounded bg-white mt-4">


                <RaiseComplaint/>
            
            </div>
        
        }

        <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-5 right-8 z-50 bg-blue-400 hover:bg-red-700 text-white rounded-full p-4 shadow-lg"
        >
            {isOpen ? <FaTimes /> : <FaCommentDots />}
        </button>   
         {isOpen && (
            <div className="fixed bottom-20 right-5 w-[380px] h-[550px] bg-white shadow-xl rounded-xl z-40 overflow-hidden border border-gray-300 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-300 font-semibold">
                <span >Chat with us</span>
                <button onClick={() => setIsOpen(false)}>
                <FaTimes />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <ChatBotUi />
            </div>
            </div>
        )}

        </div>
    </div>
  ) 
}
export default FAQPage