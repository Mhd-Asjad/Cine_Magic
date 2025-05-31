import React from 'react'
import { useChat } from "ai/react"
import { ChatMessages } from '@/components/ui/chat'
import { ChatContainer } from '@/components/ui/chat'
import { ChatForm } from '@/components/ui/chat'
import { MessageInput } from '@/Components/ui/message-input'
import { MessageList } from '@/Components/ui/message-list'
import { PromptSuggestions } from '@/Components/ui/prompt-suggestions'
import { sentToChatBot } from './Chatbotapi'

export function ChatBotUi() {

    const current_user = localStorage.getItem('current_user_type');
    const token = localStorage.getItem(`${current_user}_token`);


    // const [ messages , setMessages ] = useState()
    const { messages, input, handleInputChange, append ,  handleSubmit, isLoading, stop } = useChat({
        api : 'http://127.0.0.1:8000/review/chatbot/',
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

    const lastMessage = messages.at(-1)
    const isEmpty = messages.length === 0
    const isTyping = lastMessage?.role === "user"
    console.log(messages)

  return (
    <div className="flex flex-col p-4 h-full">

        <ChatContainer>

            <div className='mb-4' >

                {isEmpty ? (
                    <PromptSuggestions
                    append={append}
                    suggestions={["How to report a complaint?", "Track my last ticket"]}
                    />
                ) : null}
            </div>

        {!isEmpty ? (
            <ChatMessages>
             <MessageList messages={messages} isTyping={isTyping} />
            </ChatMessages>
        ) : null}

            {/* <form onSubmit={handleSubmit} > */}



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
            {/* </form> */}
        </ChatContainer>
    </div>
  )
}

export default ChatBotUi
