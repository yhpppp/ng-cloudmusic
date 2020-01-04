import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

interface Style {
  height?: string | null;
  width?: string | null;
  left?: number | null;
  bottom?: number | null;
}
@Component({
  selector: 'app-wy-slider-track',
  template: `
    <div class="wy-slider-track"></div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderTrackComponent implements OnInit, OnChanges {
  @Input() wyVertical = false;
  @Input() wyLength: number;

  style: Style = {};
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const length = 'wyLength';
    if (changes[length]) {
      if (this.wyVertical) {
        this.style.height = this.wyLength + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = this.wyLength + '%';
        this.style.height = null;
        this.style.bottom = null;
      }
    }
  }

  ngOnInit() {}
}
