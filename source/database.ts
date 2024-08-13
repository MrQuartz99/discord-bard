import EventEmitter from 'events';
import mongoose from 'mongoose';
import {PromptSchema, GuildSchema, ChatSchema} from './models/index';

interface IConnection extends mongoose.Connection {
    Prompt?: mongoose.Model<any, any, any, any> ,
    Guild?: mongoose.Model<any, any, any, any>,
    Chat?: mongoose.Model<any, any, any, any>
}

let connection: IConnection & EventEmitter;

export const initializeDatabase = async () => {
    try {
        // Connect to the database and get the connection instance
        connection = mongoose.createConnection(process.env.MongoURL!, {
            dbName: 'DiscordBard'
        }) as mongoose.Connection & EventEmitter;

        // Use the `on` method on the connection instance
        connection.on('error', (err: mongoose.MongooseError): void => {
            console.error('[Database] Error:', err);
        });

        connection.on("connected" , () => {
            console.log(`[Database] Connected to ${connection.name} on ${connection.host}:${connection.port}`);
        })

        connection.on("disconnected" , () => {
            console.log(`[Database] Disconnected from ${connection.name} on ${connection.host}:${connection.port}`);    
        })
        connection.Prompt = connection.model('Prompt', PromptSchema)
        connection.Guild = connection.model('Guild', GuildSchema)
        connection.Chat = connection.model('Chat', ChatSchema)



    } catch (err) {
        console.error('[Database] Connection failed:', err);
    }
}


export const getDatabase = () => connection
export const getPromptModel = () => connection.Prompt
export const getGuildModel = () => connection.Guild
export const getChatModel = () => connection.Chat
