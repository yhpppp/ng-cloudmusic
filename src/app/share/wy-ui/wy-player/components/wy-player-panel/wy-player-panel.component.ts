import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from '@angular/core';
import { Song } from '../../../../../services/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnChanges, OnInit {
  @Input() songlist: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean;
  @Output() opChangeSong = new EventEmitter<Song>();
  @Output() opClose = new EventEmitter();

  scrollY = 0;
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<
    WyScrollComponent
  >;
  constructor() {}
  // 更新滚动条位置
  private scrollToCurrent() {
    // 获取当前列表所有li
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll(
      'ul li'
    );
    const currentLi = songListRefs[this.currentIndex || 0];
    console.log('currentIndex :) ', this.currentIndex);

    const offsetTop = currentLi.offsetTop;
    const offsetHeight = currentLi.offsetHeight;
    // console.log('offsetTop :) ', offsetTop);
    // console.log('this.scrollY :) ', this.scrollY);

    // 下一首 || 上一首
    if (
      offsetTop - Math.abs(this.scrollY) > offsetHeight * 5 ||
      offsetTop < Math.abs(this.scrollY)
    ) {
      this.wyScroll.first.scrollToElement(currentLi, 300, false, false);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes :) ', changes);
    const show = 'show';
    const currentSong = 'currentSong';
    // 监听 show 的改变
    if (changes[show]) {
      // 更新显示滚动条
      if (!changes[show].firstChange && this.show) {
        // console.log(' 显示面板时...', this.wyScroll);
        this.wyScroll.first.asyncRefresh();
        // 打开面板时滚动到当前位置
        setTimeout(() => {
          this.scrollToCurrent();
        }, 90);
      }
    }
    // // 监听 currentSong 的改变
    if (changes[currentSong] && this.show) {
      // 切歌时滚动位置更新
      this.scrollToCurrent();
    }
  }

  ngOnInit() {}
}
