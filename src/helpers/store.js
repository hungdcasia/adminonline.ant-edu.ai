import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

function getStore(){
    const loggerMiddleware = createLogger();
    var middlewares = [thunkMiddleware];
    if(process.env.NODE_ENV == 'development')
        middlewares.push(loggerMiddleware);
    return createStore(
        rootReducer,
        applyMiddleware(
            ...middlewares
        )
    );
}

export const store = getStore();