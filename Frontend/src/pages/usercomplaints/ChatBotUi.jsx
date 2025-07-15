import React, { useEffect, useState } from 'react'
import { useChat } from "ai/react"
import { ChatMessages } from '@/components/ui/chat'
import { ChatContainer } from '@/components/ui/chat'
import { ChatForm } from '@/components/ui/chat'
import { MessageInput } from '@/components/ui/message-input'
import { MessageList } from '@/components/ui/message-list'
import { PromptSuggestions } from '@/components/ui/prompt-suggestions'
import apiReview from '@/axios/Reviewapi'

export function ChatBotUi({ setLastMessageId}) {
    const current_user = localStorage.getItem('current_user_type');
    const token = localStorage.getItem(`${current_user}_token`);


    const [historyLoaded , setHistoryLoaded ] = useState(false)
    const { messages, input, handleInputChange, append , setMessages ,  handleSubmit, isLoading, stop } = useChat({
        api : 'https://api.cine-magic.fun/review/chatbot/',
        streamProtocol : 'text',
        headers :  {
            "Authorization" : `Bearer ${token}`
        },
        onFinish : (message) => {
            console.log('fished messages ' , message)
        },
        onError: (error) => {
            console.error('Chat error:', error);
        }
    });

    useEffect(() => {
        const fetchChatLog = async() => {
            try {
                const res = await apiReview.get('chat-history/')
                const data = res.data;
                if (res.status === 200 && data.length > 0) {
                    const formattedMessage = data.map((log) => ({
                        id: log.id.toString(),
                        role: log.role,
                        content: log.content,
                        createdAt: new Date(log.timestamp)
                    }));
                    console.log(formattedMessage)
                    setMessages(formattedMessage)                          
                }
                setHistoryLoaded(true)
            }catch(error){
                console.log('history log error' , error);
                
            }
        }
        fetchChatLog()

    },[])

    
    
    const lastMessage = messages.at(-1)
    const isEmpty = messages.length === 0
    const isTyping = lastMessage?.role === "user"
    setLastMessageId(lastMessage?.id)
        if (!historyLoaded) {
        return (
            <div className='flex justify-center mt-[55%]' >
                loading....
            </div>
        )
    }
  return (
    <div className="grid grid-flow-row grid-cols-1 p-4 h-full">

        <ChatContainer>

            <div className='mb-4' >

                {isEmpty ? (
                    <PromptSuggestions
                    append={append}
                    suggestions={[ "Track my last ticket" , 'How Can I Cancel My Ticket?' , 'How can I contact customer care?']}
                    />
                ) : null}
            </div>

        {!isEmpty ? (
            <ChatMessages>
                <div>

                 <MessageList messages={messages} isTyping={isTyping}/>

                </div>
            </ChatMessages>
        ) : null}

        <div className='' >


            <ChatForm
            
                className="mt-auto h-full"
                isPending={isLoading || isTyping}
                handleSubmit={handleSubmit}
                >

                {({ files, setFiles }) => (
                    <MessageInput
                        value={input}
                        onChange={handleInputChange}
                        allowAttachments={false}
                        files={files}
                        setFiles={setFiles}
                        stop={stop}
                        isGenerating={isLoading}
                    />
                )}

            </ChatForm>
        </div>
        </ChatContainer>
    </div>
  )
}

export default ChatBotUi
