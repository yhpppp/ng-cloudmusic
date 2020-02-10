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

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<
    WyScrollComponent
  >;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes :) ', changes);
    const show = 'show';
    // 更新滚动条
    if (changes[show]) {
      if (!changes[show].firstChange && this.show) {
        console.log(' 显示面板时...', this.wyScroll);
        this.wyScroll.first.asyncRefresh();
      }
    }
  }

  ngOnInit() {}
}
