import config from '../config';
import {
  LOAD_MENU_SUCCESS,
  LOAD_PLAYER_SUCCESS,
} from '../constants';

async function fetchData(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

export async function loadMenu(dispatch) {
  const data = await fetchData(`${config.hostJson}/index.json`);
  dispatch({ type: LOAD_MENU_SUCCESS, data });
}

export async function loadPlayerData(dispatch, id) {
  const data = await fetchData(`${config.hostJson}/files/${id}.json`);
  dispatch({ type: LOAD_PLAYER_SUCCESS, id, data });
}
