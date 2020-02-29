import { Lyric } from '../../../../../services/data-types/common.types';
// [00:34.940]
// 歌词时间正则
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export interface BaseLyricLine {
  txt: string;
  txtCn: string;
}

interface LyricLine extends BaseLyricLine {
  time: number;
}
export class WyLyric {
  private lrc: Lyric;
  lines: LyricLine[] = [];

  constructor(lrc: Lyric) {
    this.lrc = lrc;
    this.init();
  }

  private init() {
    if (this.lrc.tlyric) {
      this.generTLyric();
    } else {
      this.generLyric();
    }
  }
  // 处理中文
  private generLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line => {
      this.makeLine(line);
    });
  }

  private makeLine(line: string) {
    // 抽离时间
    const result = timeExp.exec(line);
    // console.log('result :) ', result);

    if (result) {
      // 抽离文字
      const txt = line.replace(timeExp, '').trim();
      // console.log('txt :) ', txt);

      const txtCn = '';
      if (txt) {
        const thirdResult = result[3] || '00';
        const newThirdResult =
          thirdResult.length > 2
            ? parseInt(thirdResult, 10)
            : parseInt(thirdResult, 10) * 10;
        // 算出当前歌词的时间(秒)
        const time =
          Number(result[1]) * 1000 * 60 +
          Number(result[2]) * 1000 +
          newThirdResult;
        this.lines.push({ txt, txtCn, time });
      }
    }
  }
  // 处理英文
  private generTLyric() {}
}
