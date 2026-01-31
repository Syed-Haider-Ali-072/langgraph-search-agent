console.log("working!!!!!!!!!!!!!!"); 
const input = document.querySelector('#input');
const chatcontainer = document.querySelector('#chat-container');
const askbtn = document.querySelector('#ask');

const threadid = Date.now().toString(36) + Math.random().toString(36).substring(2,8);


console.log(input);

input?.addEventListener('keyup', handleenter);
askbtn?.addEventListener('click', handleask);

const loading = document.createElement('div');
loading.className = 'my-6 animate-pulse';
loading.textContent = 'Thinking....';

async function generate(text) {
    const msg = document.createElement('div');
    msg.className = 'my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit';
    msg.textContent = text;
    chatcontainer.appendChild(msg);
    input.value = '';

    chatcontainer?.appendChild(loading);

    // call server
    const assistantmessage = await callserver(text);

    const assistantmsgelem = document.createElement('div');
    assistantmsgelem.className = 'max-w-fit';
    assistantmsgelem.textContent = assistantmessage;

    loading.remove();

    chatcontainer.appendChild(assistantmsgelem);
    

   
}

async function callserver(input) {
    const response = await fetch('http://localhost:30001/chat', {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ threadid: threadid, message: input }),
    });

    if (!response.ok) {
        throw new Error("Error generating the response.");
    }
    const result = await response.json();
    return result.message;
}

async function handleask(e) {
    const text = input?.value.trim();
    if (!text) {
        return;
    }
    await generate(text);
}

async function handleenter(e) {
    if (e.key == 'Enter') {    
        const text = input?.value.trim();
        if (!text) {
            return;
        }
        await generate(text);
    }
}
