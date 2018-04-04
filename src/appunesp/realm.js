'use strict';

import Realm from 'realm';
export const messagesTable = 'messages' + 'v11';

class Message extends Realm.Object {}
Message.schema = {
    name: messagesTable, 
    primaryKey: 'id',
    properties: {
        id             : 'string',
        favorite       : 'string',
        hasAttachment  : 'string',
        sentBy         : 'string',
        subject        : 'string',
        sentDate       : 'string',
        readDate       : 'string',
        sisgradId      : 'string',
        message        : 'string',
    },
};

  
export const schemas = {
    schema: [Message]
}

export default new Realm(schemas);