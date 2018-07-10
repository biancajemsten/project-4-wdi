import React from 'react';
import Flash from '../lib/Flash';

const FlashMessages = () => {
  const messages = Flash.getMessages();
  Flash.clearMessages();

  return(
    <div className="container">
      {messages && Object.keys(messages).map(type =>
        <div key={type} className={`notification is-${type}`}>{messages[type]}</div>
      )}
    </div>
  );
};

export default FlashMessages;
