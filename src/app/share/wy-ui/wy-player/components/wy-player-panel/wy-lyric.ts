import { Lyric } from '../../../../../services/data-types/common.types';
import { Observable, zip, from } from 'rxjs';
import { skip } from 'rxjs/internal/operators';
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

  // 合并 中&英&时间
  private makeLine(line: string, tLine = '') {
    // 抽离时间
    const result = timeExp.exec(line);
    // console.log('result :) ', result);

    if (result) {
      // 抽离默认文字
      const txt = line.replace(timeExp, '').trim();
      const txtCn = tLine ? tLine.replace(timeExp, '').trim() : '';

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

  // 处理默认文字
  private generLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line => {
      this.makeLine(line);
    });
  }
  // 处理英文翻译
  private generTLyric() {
    let tempArr = [];
    let zipLines$: Observable<any>;

    const lines = this.lrc.lyric.split('\n');
    const tLines = this.lrc.tlyric
      .split('\n')
      .filter(item => timeExp.exec(item) !== null);

    const moreLineNum = lines.length - tLines.length;

    if (moreLineNum >= 0) {
      // [主,次]
      tempArr = [lines, tLines];
    } else {
      tempArr = [tLines, lines];
    }
    // 拿到少的一方的第一个数据的时间
    const first = timeExp.exec(tempArr[1][0])[0];
    // 拿到主中[主,次]时间相同的首次下标
    let skipIndex = tempArr[0].findIndex(item => {
      const time = timeExp.exec(item);
      if (time) {
        // 对比时间拿到下标
        return time[0] === first;
      }
    });
    skipIndex = skipIndex === -1 ? 0 : skipIndex;
    // 取出多余的信息
    // 如:  0: "[00:00.000] 作曲 : Selena Gomez"
    const skipItems = tempArr[0].slice(0, skipIndex);
    if (skipItems.length) {
      skipItems.forEach(item => {
        // 把多余信息先推入生成对象
        // { txt:"[00:00.000] 作曲 : Selena Gomez", txtCn:'', time: 0}
        this.makeLine(item);
      });
    }
    // 合并数组 对应的时间的中英歌词
    if (moreLineNum > 0) {
      zipLines$ = zip(from(lines).pipe(skip(skipIndex)), from(tLines));
    } else {
      zipLines$ = zip(from(lines), from(tLines).pipe(skip(skipIndex)));
    }
    zipLines$.subscribe(([line, tLine]) => {
      this.makeLine(line, tLine);
    });
  }
}
