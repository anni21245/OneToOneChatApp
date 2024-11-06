document.addEventListener("DOMContentLoaded", () => {
    const socket = new SockJS('/ws');
    const stompClient = Stomp.over(socket);

    function handleIncomingMessage(messageOutput) {
        const message = JSON.parse(messageOutput.body);
        const chatMessages = document.getElementById("chat-messages");
        chatMessages.innerHTML += `<div><strong>${message.sender}:</strong> ${message.content}</div>`;
    }

    function updateOnlineUsers(users) {
        const usersList = document.getElementById("connectedUsers");
        usersList.innerHTML = '';
        users.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = `${user.fullName} (${user.nickName})`;
            usersList.appendChild(listItem);
        });
    }

    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);

        // Subscribe to topic for incoming messages
        stompClient.subscribe('/topic/public', handleIncomingMessage);

        // Subscribe to topic for online users
        stompClient.subscribe('/topic/onlineUsers', (message) => {
            const users = JSON.parse(message.body);
            updateOnlineUsers(users);
        });

        // Send initial user join message
        stompClient.send('/app/user.addUser', {}, JSON.stringify({
            nickName: document.getElementById("nickname").value,
            fullName: document.getElementById("fullname").value,
            status: "ONLINE"
        }));
    });

    document.getElementById("messageForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const messageContent = document.getElementById("message").value;
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify({
            sender: document.getElementById("nickname").value,
            content: messageContent
        }));
        document.getElementById("message").value = '';
    });

    document.getElementById("usernameForm").addEventListener("submit", (event) => {
        event.preventDefault();
        document.getElementById("username-page").classList.add("hidden");
        document.getElementById("chat-page").classList.remove("hidden");
    });

    document.getElementById("logout").addEventListener("click", () => {
        stompClient.send('/app/user.disconnectUser', {}, JSON.stringify({
            nickName: document.getElementById("nickname").value,
            status: "OFFLINE"
        }));
        stompClient.disconnect(() => {
            console.log('Disconnected');
            document.getElementById("chat-page").classList.add("hidden");
            document.getElementById("username-page").classList.remove("hidden");
        });
    });

    // Handle URL parameters
    const params = new URLSearchParams(window.location.search);
    const nickname = params.get("nickname");
    const realname = params.get("realname");

    if (nickname && realname) {
        document.getElementById("nickname").value = nickname;
        document.getElementById("fullname").value = realname;
        document.getElementById("usernameForm").dispatchEvent(new Event('submit')); // Auto-submit form
    }
});
