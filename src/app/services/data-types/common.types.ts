/**
 * 数据类型
 */

// 轮播图
export interface Banner {
  targetId: number;
  imageUrl: string;
  url: string;
}

// 热门推荐标签
export interface HotTag {
  id: number;
  position: number;
  name: string;
}

// 歌单
export interface SongList {
  id: number;
  playCount: number;
  picUrl: string;
  name: string;
  tracks: Song[]; // 歌曲列表
}

// 歌手
export interface Singer {
  id: number;
  albumSize: number;
  name: string;
  img1v1Url: string;
}

// 歌曲
export interface Song {
  id: number;
  name: string;
  url: string; // mp3地址
  ar: Singer[];
  al: { id: number; name: string; picUrl: string }; // 专辑
  dt: number; // 总时长
}

// 播放地址
export interface SongUrl {
  id: number;
  url: string;
}

export interface Lyric {
  lrc: string;
  tlyric: string;
}
