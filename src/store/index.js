import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import blockchain from './blockchain';

export default createStore(blockchain, applyMiddleware(thunk));
