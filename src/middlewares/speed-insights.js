'use strict';

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV;


const trackEvent = (eventName, data = {}) => {
    if (isProduction) {
        console.log(`[Speed Insights] ${eventName}:`, JSON.stringify(data, null, 2));
    } else {
        console.log(`[Dev - Speed Insights] ${eventName}:`, data);
    }
};

export const trackEventMiddleware = (eventName, additionalData = {}) => {
    return (req, res, next) => {
        const startTime = Date.now();
        
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            
            trackEvent(eventName, {
                path: req.path,
                method: req.method,
                status_code: res.statusCode,
                duration: duration,
                user_agent: req.get('User-Agent'),
                ip: req.ip,
                timestamp: new Date().toISOString(),
                ...additionalData
            });
        });
        
        next();
    };
};

export const trackAuth = trackEventMiddleware('auth_request', { type: 'authentication' });

export const trackDatabase = trackEventMiddleware('database_operation', { type: 'database' });

export const trackUpload = trackEventMiddleware('file_upload', { type: 'upload' });

export const trackCRUD = (operation) => trackEventMiddleware('crud_operation', { operation });

export const trackApiRoutes = (req, res, next) => {
    if (!req.path.startsWith('/BLFAGS/v1/')) {
        return next();
    }
    
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        trackEvent('api_request', {
            route: req.route?.path || req.path,
            method: req.method,
            status_code: res.statusCode,
            duration: duration,
            endpoint: req.path.split('/')[3], 
            timestamp: new Date().toISOString()
        });
    });
    
    next();
};
