'use strict';

export const speedInsightsConfig = {
    enabled: process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV,
    
    events: {
        API_REQUEST: 'api_request',
        AUTH_REQUEST: 'auth_request', 
        DATABASE_OPERATION: 'database_operation',
        FILE_UPLOAD: 'file_upload',
        CRUD_OPERATION: 'crud_operation',
        ERROR_OCCURRED: 'error_occurred',
        SLOW_QUERY: 'slow_query'
    },
    
    thresholds: {
        slowResponse: 1000,
        verySlowResponse: 3000
    }
};

const logEvent = (eventName, data) => {
    if (speedInsightsConfig.enabled) {
        console.log(`[Speed Insights - Production] ${eventName}:`, JSON.stringify(data, null, 2));
    } else {
        console.log(`[Speed Insights - Dev] ${eventName}:`, data);
    }
};

export const trackWithConfig = (eventName, data = {}) => {
    if (!speedInsightsConfig.enabled && process.env.NODE_ENV !== 'development') {
        return;
    }
    
    try {
        logEvent(eventName, {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            ...data
        });
    } catch (error) {
        console.warn('Speed Insights tracking error:', error);
    }
};

export const trackError = (error, context = {}) => {
    trackWithConfig(speedInsightsConfig.events.ERROR_OCCURRED, {
        error_message: error.message,
        error_stack: error.stack?.substring(0, 500), // Limitar el stack trace
        ...context
    });
};

export const trackSlowQuery = (queryInfo, duration) => {
    if (duration > speedInsightsConfig.thresholds.slowResponse) {
        trackWithConfig(speedInsightsConfig.events.SLOW_QUERY, {
            ...queryInfo,
            duration,
            is_very_slow: duration > speedInsightsConfig.thresholds.verySlowResponse
        });
    }
};

export const errorTrackingMiddleware = (err, req, res, next) => {
    trackError(err, {
        path: req.path,
        method: req.method,
        user_agent: req.get('User-Agent'),
        ip: req.ip
    });
    
    next(err);
};
