import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { SongList } from '../../../services/data-types/common.types';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {
  @Input() sheet: SongList;
  @Output() eventPlay = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  onPlaySheet(id: number) {
    this.eventPlay.emit(id);
  }
}
