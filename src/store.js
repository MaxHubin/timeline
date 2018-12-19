import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from './reducers/rootReducer';

export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middleware = [
    thunk,
  ];
  return createStore(
    createRootReducer(),
    composeEnhancers(
      applyMiddleware(...middleware),
    ),
  );
}
