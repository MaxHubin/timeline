import { combineReducers } from 'redux';

import player from './player';
import menu from './menu';

export default () => combineReducers({
  player,
  menu,
});
