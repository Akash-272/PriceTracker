import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery',true);
    if(!process.env.MONGO_URI){
        return console.log('MONGO_URI is not defined');
    }

    if(isConnected){
        console.log('=> Using existing database connection');
        return;

    }

    try{
        mongoose.connect(process.env.MONGO_URI);
        isConnected=true;

    }catch(error)
    {
        console.log('Error');
    }
}