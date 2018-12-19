import { LOAD_PLAYER_SUCCESS, SET_CURRENT_CLUSTER } from '../constants';
import mp4Helper from '../helper/mp4Helper';

const initialState = {
  data: null,
  currentCluster: 1,
};
window.mp4Helper = mp4Helper;
function getTimestamps(videoInfo) {
  const options = {
    commonOffset: 0.0001,
  };
  const timestaps = mp4Helper.generateTimestamps(videoInfo, options).map(timestamp => timestamp + videoInfo.startTime);
  return timestaps;
}


export default function player(state = initialState, action) {
  switch (action.type) {
    case LOAD_PLAYER_SUCCESS:
      return {
        ...state,
        data: {
          ...action.data,
          timestamps: getTimestamps(action.data.videoInfo),
        },
        currentCluster: action.data.clusterAnalysis[0].mode,
      };
    case SET_CURRENT_CLUSTER:
      return {
        ...state,
        currentCluster: action.currentCluster,
      };
    default:
      return state;
  }
}
