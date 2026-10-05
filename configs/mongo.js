import mongoose from 'mongoose';
export const dbConnection = () => mongoose.connect(process.env.URI_MONGO,{serverSelectionTimeoutMS:10000,maxPoolSize:10,autoIndex:process.env.NODE_ENV !== 'production'});
