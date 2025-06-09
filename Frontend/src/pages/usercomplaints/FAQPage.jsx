import React, { useEffect, useState , useRef } from 'react'
import apiReview from '@/axios/Reviewapi'
import Nav from '@/components/navbar/Nav'
import { FaCommentDots, FaTimes } from "react-icons/fa";
import ChatBotUi from './ChatBotUi';
import RaiseComplaint from './RaiseComplaint';
import { useSelector } from 'react-redux';
import { IoMdArrowDropdown , IoMdArrowDropup } from "react-icons/io";
import BlurText from '../reactBits/BlurText';

function FAQPage() {

    const [faqs , setFaqs ] = useState([])
    const [showCommonQuestions , setShowCommonQuestions ] = useState(false)
    const [raiseComplaintForm , setRaiseComplaintForm] = useState(false)
    const [ chatLogId , setChatLogId ] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const user = useSelector((state) => state.user)
    const userQueries = [
        {
        title: "Ticket Issues",
        keywords: ["booking", "ticket cancel", "reschedule"],
        example: "How can I cancel my movie ticket?"
        },
        {
        title: "Payment Problems",
        keywords: ["refund", "payment failed", "transaction"],
        example: "I didn’t get a refund after payment failed."
        },
        {
        title: "Complaint Registration",
        keywords: ["complaint", "report", "issue"],
        example: "How do I file a complaint?"
        },
        {
        title: "Other Support",
        keywords: ["support", "help", "contact"],
        example: "How can I contact customer care?"
        }
    ]

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
    console.log(chatLogId)

    
    useEffect(() => { 
        const el = containerRef.current;
        if (el) {
            console.log('el found' , el)
            el.scrollTop = el.scrollHeight;
        }
    },[chatLogId])

  return (
    <div className='bg-gray-50 min-h-screen' >
        <Nav />

        <div className="max-w-3xl mx-auto p-4">
        <BlurText style={{position : 'relative'}}
            text="Help Center"
            delay={150}
            animateBy="letter"
            direction="top"
            className="text-2xl mb-8"
        />



        <div className="p-4 border rounded-md bg-gray-50 shadow-sm">
            <h3 className="text-lg font-bold mb-2">💬 How can I help you?</h3>
            <p className="text-sm mb-4 text-gray-600">
                Ask about bookings, payments, or complaints. Try Chat Assitant 🤖
            </p>
            <ul className="space-y-2">
                {userQueries.map((item, index) => (
                <li key={index}>
                    <strong >{item.title}:</strong> <em>{item.example}</em>
                    <div className='flex mt-2 gap-2 bg-blue-200 ' >
                        < span className='ml-2 font-semibold' > further Query : </span>
                        {item.keywords.map((k) => (
                            <span>{`${k} |`} </span>
                            
                        ))
                        }
                    </div>
                </li>


                ))}
            </ul>
            <div className='flex justify-center mt-3' >
                <p>if your issue not resolved Raise issue using form...! </p>
            </div>
        </div>
        <div className="max-w-3xl mx-auto mt-[5%] bg-blend-soft-light space-y-4">
            <div 
                onClick={hanldeQns}
                className="flex justify-between gap-1 py-3 px-4 bg-gray-100 rounded shadow-sm hover:bg-gray-200 cursor-pointer"
            >
                Common FAQ

                <div >
                    {showCommonQuestions ? <IoMdArrowDropup size={28} /> : <IoMdArrowDropdown size={28}  />}
                </div>
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
            className="flex justify-between gap-1 py-3 px-4 bg-gray-100 rounded shadow-sm hover:bg-gray-200 cursor-pointer mt-4 "
            onClick={handleComplaintForm}
            
        >
            Submit issue
            
            <div >
                {raiseComplaintForm ? <IoMdArrowDropup size={28} /> : <IoMdArrowDropdown size={28}  />}
            </div>
        

        </div>

        {raiseComplaintForm && 

            <div className="space-y-4 p-4 rounded bg-white mt-4">

                <RaiseComplaint chatId={chatLogId} userId={user.id}  closeForm={handleComplaintForm} />

            </div>
        
        }

        <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-5 right-8 z-50 bg-blue-400 text-white rounded-full p-4 shadow-lg"
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

            <div ref={containerRef} className="flex-1 overflow-y-auto md:h-1/2">
                <ChatBotUi setLastMessageId={setChatLogId} />
            </div>
            </div>
        )}

        </div>
    </div>
  ) 
}
export default FAQPage