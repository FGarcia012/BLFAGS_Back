'use strict';

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { dbConnection } from './mongo.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/user/user.routes.js';
import hashtagRoutes from '../src/hashtag/hashtag.routes.js';
import commentRoutes from '../src/comment/comment.routes.js';
import publicationRoutes from '../src/publication/publication.routes.js';
import apiLimiter from '../src/middlewares/rate-limit-validator.js';
import { swaggerDocs, swaggerUi } from './swagger.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(apiLimiter);
};

const routes = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use('/BLFAGS/v1/auth', authRoutes);
    app.use('/BLFAGS/v1/user', userRoutes);
    app.use('/BLFAGS/v1/hashtag', hashtagRoutes);
    app.use('/BLFAGS/v1/comment', commentRoutes);
    app.use('/BLFAGS/v1/publication', publicationRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection();
    } catch (err) {
        console.log(`Database connection failed: ${err}`);
        process.exit(1);
    }
};

export const initServer = async () => {
    const app = express()
    try{
        middlewares(app)
        conectarDB()
        routes(app)
        const port = process.env.PORT || 3020
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch(err){
        console.log(`Server initialization failed: ${err}`)
    }
}