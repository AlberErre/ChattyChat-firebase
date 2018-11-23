import React, { Component } from 'react';
import firebase from 'firebase';
import ChattyLogo from './components/ChattyLogo';
import MessengerScreen from './components/MessengerScreen';
import TextInput from './components/TextInput';
import SendButton from './components/SendButton';
import UserName from './components/UserName';
import UserCounter from "./components/UserCounter";
import './App.css';

const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  databaseURL: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  projectId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  storageBucket: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  messagingSenderId: "XXXXXXXXXXXXXXXXXXXXXXXXX"
};

const chatChannel = "ChattyChat_channel_01";
const db = firebase.database();

firebase.initializeApp(firebaseConfig);

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: "someone",
      usercount: 0,
      chatMessages: []
    }
    
    this.updateUserName = this.updateUserName.bind(this);
    this.sendMessageToChat = this.sendMessageToChat.bind(this);
  }
  
  componentWillMount() {
    
    db.ref(chatChannel).on("child_added", snapshot => {
      let data = snapshot.val();
      let newMessage = `<p>${data.user} (${data.timestamp}): ${data.message}</p>`;

      this.setState({
          chatMessages: [...this.state.chatMessages, newMessage]
      });
    });
  }
  
  updateUserName(event) {
    event.preventDefault();

    let newUserName = event.target.elements.userNameToUpdate.value;

    if (newUserName) {
      this.setState({
        userName: newUserName
      });
    }
  }
  
  sendMessageToChat(event) {
    event.preventDefault();

    let messageText = event.target.elements.messageToSend.value;

    if (messageText) {
      let messageInfo = {
        user: this.state.userName,
        message: messageText,
        timestamp: Date.now()
      };
      db.ref(chatChannel).push(messageInfo);
      // clean input area on click
      event.target.elements.messageToSend.value = '';
    }
  }
  
  render() {
    return (
      <div className="appContainer globalBackground">
      
        <div className="topContainer">
          <ChattyLogo />
          <UserName
            updateUserName={this.updateUserName}   
          />
        </div>
        
        <MessengerScreen
          chatMessages={this.state.chatMessages}
        />
        
        <UserCounter
          usercount={this.state.usercount}
        />
        
        <div className="inputContainer">
          <form onSubmit={this.sendMessageToChat}>
            <TextInput />
            <SendButton />          
          </form>
        </div>
        
      </div>
    );
  }
}

export default App;
