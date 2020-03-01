import { Lyric } from '../../../../../services/data-types/common.types';
import { Observable, zip, from, Subject } from 'rxjs';
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

interface Handler extends BaseLyricLine {
  lineNum: number;
}

export class WyLyric {
  private lrc: Lyric;
  lines: LyricLine[] = [];
  private playing = false;
  private curNum: number;
  private startStamp: number;
  private timer: any;
  // 暂停时的时间
  private pauseStamp: number;
  handler = new Subject<Handler>();

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

  // 根据时间获取当前行的下标
  private findCurNum(time: number): number {
    const index = this.lines.findIndex(item => item.time <= time);
    return index === -1 ? this.lines.length - 1 : index;
  }

  //
  callHandler(index: number) {
    this.handler.next({
      txt: this.lines[index].txt,
      txtCn: this.lines[index].txtCn,
      lineNum: index
    });
  }
  //
  private playReset() {
    // 获取当前行的数据
    const line = this.lines[this.curNum];
    const delay = line.time - (Date.now() - this.startStamp);
    console.log('delay :) ', delay);
    this.timer = setTimeout(() => {
      this.callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.playing) {
        this.playReset();
      }
    }, delay);
  }

  stop() {
    if (this.playing) {
      this.playing = false;
    }
    clearTimeout(this.timer);
  }

  // 播放歌词
  play(startTime = 0) {
    if (!this.lines.length) {
      return;
    }
    if (!this.playing) {
      this.playing = true;
    }

    this.curNum = this.findCurNum(startTime);
    console.log('this.curNum :) ', this.curNum);
    this.startStamp = Date.now() - startTime;
    console.log('this.startStamp :) ', this.startStamp);

    // 不是最后结尾时继续更新歌词位置
    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer);
      this.playReset();
    }
  }

  // 播放暂停歌词
  togglePlay(playing: boolean) {
    const now = Date.now();
    this.playing = playing;
    if (playing) {
      const startTime = (this.pauseStamp || now) - (this.startStamp || now);
      this.play(startTime);
    } else {
      this.stop();
      this.pauseStamp = now;
    }
  }
}
