export async function sentToChatBot(messages){
    const current_user = localStorage.getItem('current_user_type');
    const token = localStorage.getItem(`${current_user}_token`);
    console.log('sending to the backed')
    try {
        const response = await fetch("https://api.cine-magic.fun/review/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization" : `Bearer ${token}`
          
        },  
        body: JSON.stringify({ messages }),
    
        });
    
        const data = await response.json();
        console.log(data)
        return {
          role: "assistant",
          content: data.reply,
        };

    }catch(e){
      console.log(e , 'error while fetching bot response' , e)
    }
}