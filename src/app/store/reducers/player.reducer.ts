import { PlayMode } from '../../share/wy-ui/wy-player/player-type';
import { Song } from '../../services/data-types/common.types';
import { createReducer, on, Action } from '@ngrx/store';
import {
  SetPlaying,
  SetPlayList,
  SetSongList,
  SetPlayMode,
  SetCurrentIndex
} from '../actions/player.action';

export interface PlayState {
  // 播放状态
  playing: boolean;
  // 正在播放的索引
  currentIndex: number;
  // 播放模式
  playMode: PlayMode;
  // 播放列表
  playList: Song[];
  // 歌曲列表
  songList: Song[];
}

export const initialState: PlayState = {
  playing: false,
  currentIndex: -1,
  playMode: { type: 'loop', label: '循环' },
  playList: [],
  songList: []
};

const reducer = createReducer(
  initialState,
  on(SetPlaying, (state, { playing }) => ({ ...state, playing })),
  on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
  on(SetSongList, (state, { songList }) => ({ ...state, songList })),
  on(SetPlayMode, (state, { playMode }) => ({ ...state, playMode })),
  on(SetCurrentIndex, (state, { currentIndex }) => ({ ...state, currentIndex }))
);

export function playerReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}
