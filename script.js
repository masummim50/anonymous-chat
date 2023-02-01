
var socket = io();

let chatwindow = 'global';
const global = document.getElementById("global");
const header = document.getElementById("header");
const left = document.getElementById("left");
const close = document.getElementById("close");
const setUsername = document.getElementById("set-username");
const usernameButton = document.getElementById('username-button');
const chatSection = document.getElementById("chat-section")
const userinput = document.getElementById("username-input");
const userlistContainer = document.getElementById("userlist-container");
const you = document.getElementById("you");
const textInput = document.getElementById("text-input");
const sendText = document.getElementById("send-text");


const classes = setUsername.classList[1];
// console.log(classes)

global.addEventListener('click', ()=> {
    chatwindow = "global";
})

userinput.focus();

if(classes == 'empty'){
    chatSection.style.display = 'none';
}

const submitUsername = (name)=> {
    socket.emit('check-username', name);
}

setUsername.addEventListener("keypress", (e)=> {
    // console.log(e);
    if(e.key == 'Enter'){
        submitUsername(userinput.value);
    }
})
usernameButton.addEventListener('click', ()=> {
    submitUsername(userinput.value);
})

socket.on('user-exists', ()=> {
    const p = document.createElement('p');
    p.innerText = 'username taken';
    setUsername.prepend(p);
    userinput.value = '';
})

socket.on('user-saved', (name)=> {
    setUsername.style.display = 'none';
    chatSection.style.display = 'flex';
    const div = document.createElement('div');
    div.innerText = name;
    you.append(div)
})

socket.on('reload-users', (users)=> {
    userlistContainer.innerHTML = "";
    for(const [key, value] of Object.entries(users)){
        if(value.name){
            const name = value.name;
            const div = document.createElement('div');
            div.classList = "singleuser"
            div.innerText = name;
            userlistContainer.append(div);
        }
    }
})


userlistContainer.addEventListener("click", (event)=> {
    if(event.target.classList.contains("singleuser")){
        // console.log(event.target.innerHTML)
        chatwindow = event.target.innerHTML;
    }
})


header.addEventListener('click', ()=> {
  left.classList.add("show");
});

close.addEventListener("click", ()=> {
  left.classList.remove("show");
})

// all socket related stuff

const msg = textInput.value;
const sendMessage = (message)=> {
    socket.emit('sending-message', msg);
    // update the ui of sender
    textInput.value = "";
    textInput.focus();

}

textInput.addEventListener('keypress', (e)=> {
    if(e.key == 'Enter'){
        sendMessage(msg);
    }
})

sendText.addEventListener('click', ()=> {
    sendMessage(msg)
})
