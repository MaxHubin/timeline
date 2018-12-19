import { LOAD_MENU_SUCCESS, LOAD_PLAYER_SUCCESS } from '../constants';

const initialState = {
  items: [],
  active: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MENU_SUCCESS:
      return {
        ...state,
        items: action.data,
      };
    case LOAD_PLAYER_SUCCESS:
      return {
        ...state,
        active: { ...state.items.find(item => item.id === action.id) },
      };
    default:
      return state;
  }
};
