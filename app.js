let name;
swal({
    text: "Enter Your Name",
    content: "input",   //input type text box
    button: {
        text: "Submit",
        closemodal: true,
    },
    closeOnClickOutside: false,
    closeOnEsc: false,
}).then((res) => {
    //text save in res(username you enter)
    console.log(res);
    if (res) {
        name = res;
        localStorage.setItem("name", res);
    }
    else {
        swal("Please Enter Your Name...");
        location.href = location.href;   //redirect to main location
    }
})
let message = document.getElementById("message");
//function to send message and save message to database
sendMessage = () => {
    let date = new Date();
    let hours = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    let time = "";
    if (hours > 12) {
        //scripting, different with codeing
        time = `${Math.ceil(hours - 12)}:${min}:${sec} PM`;
        //console.log(time);
    }
    else {
        time = `${hours}:${min}:${sec} AM`;
    }
    firebase.database().ref("messages").push().set({
        "sender": name,
        "message": message.value,
        "time": time
    });
    message.value = ""
}

//Display message through database
firebase.database().ref("messages").on('child_added', (data) => {
    //console.log(data);
    let li = "";
    let localName = localStorage.getItem("name");
    if (data.val().sender === localName) {
        //console.log("OK");
        li += `
            <li class="alignRight" id="message-${data.key}">
                <span class="singleMessage" onclick="delMessage(this);" data-id=${data.key}>
                    <span class="senderName">${data.val().sender}:</span>
                    <span class="senderMessage">${data.val().message}:</span>
                    <small class="sentTime">${data.val().time}</small>
                </span>
            </li>
        `;
    }
    else {
        li += `
            <li class="alignLeft" id="messgae-${data.key}">
                <span class="singleMessage">
                    <span class="senderName">${data.val().sender}:</span>
                    <span class="senderMessage">${data.val().message}:</span>
                    <small class="sentTime">${data.val().time}</small>
                </span>
            </li>
        `;
    }
    document.getElementById("messages").innerHTML += li;
});

//Delete Message from the UI and Database
function delMessage(self) {
    var msgID = self.getAttribute("data-id");
    console.log(msgID);
    swal({
        title: "Delete Message",
        text: "Are You Sure!",
        icon: "warning",
        buttons: ["Nope", "Yes"]
    }).then((res) => {
        //console.log(res);
        if (res) {
            firebase.database().ref("messages").child(msgID).remove();
            swal({
                title: "Success",
                icon: "success",
                button: "Okay"
            })
        }
    });
}
firebase.database().ref("messages").on("child_removed",(data) => {
    document.getElementById("message-"+data.key).innerHTML = "message has been removed";
});