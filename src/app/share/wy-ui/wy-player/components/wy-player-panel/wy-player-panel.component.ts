import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { Song } from '../../../../../services/data-types/common.types';

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
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes :) ', changes);
  }

  ngOnInit() {}
}
