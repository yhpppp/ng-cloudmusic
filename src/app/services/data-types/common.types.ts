export interface Banner {
  targetId: number;
  imageUrl: string;
  url: string;
}

export interface HotTag {
  id: number;
  position: number;
  name: string;
}

export interface SongList {
  id: number;
  playCount: number;
  picUrl: string;
  name: string;
}
