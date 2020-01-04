import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

interface Style {
  left?: string | null;
  bottom?: string | null;
}

@Component({
  selector: 'app-wy-slider-handle',
  template: `
    <div class="wy-slider-handle"></div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderHandleComponent implements OnInit, OnChanges {
  @Input() wyVertical = false;
  @Input() wyOffset: number;

  style: Style = {};
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const offset = 'wyOffset';
    if (changes[offset]) {
      this.style[this.wyVertical ? 'bootom' : 'left'] = this.wyOffset + '%';
    }
  }

  ngOnInit() {}
}
