import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ViewChild,
  ElementRef,
  Inject
} from '@angular/core';
import { Observable, fromEvent, merge } from 'rxjs';
import {
  pluck,
  map,
  tap,
  filter,
  takeUntil,
  distinctUntilChanged
} from 'rxjs/internal/operators';
import { DOCUMENT } from '@angular/common';
import { getElementOffset } from 'ng-zorro-antd';
import { limitNumberInRange } from '../../../utils/number';
import { isExistInArray } from '../../../utils/array';

interface SliderEventObserverConfig {
  start: string;
  move: string;
  end: string;
  filter: (e: Event) => boolean;
  pluckKey: string[];
  startPlucked$?: Observable<number>;
  moveResolved$?: Observable<number>;
  end$?: Observable<Event>;
}
function sliderEvent(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class WySliderComponent implements OnInit {
  [x: string]: any;
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;

  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;
  private sliderDom: HTMLDivElement;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  ngOnInit() {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  /**
   * 创建拖动相关时间线
   */
  private createDraggingObservables() {
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filterFn, pluckKey } = source;
      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filterFn),
        tap(sliderEvent),
        pluck(...pluckKey),
        map((position: number) => this.findClosestValue(position))
      );

      source.end$ = fromEvent(this.doc, end);

      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filterFn),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (isExistInArray(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (isExistInArray(events, 'move') && this.dragMove$) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }

    if (isExistInArray(events, 'end') && this.dragEnd$) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private onDragStart(value: number) {
    console.log('value :) ', value);
  }

  private onDragMove(value: number) {}

  private onDragEnd() {}

  // position / 滑块组件长度 === (val - min) / (max - min)
  private findClosestValue(position: number): number {
    // 获取滑块总长
    const sliderLength = this.getSliderLength();

    // 滑块 左||上 端点位置
    const sliderStart = this.getSliderStartPosition();
    // 滑块当前位置 / 滑块总长
    const ratio = limitNumberInRange(
      (position - sliderStart) / sliderLength,
      0,
      1
    );
    // 垂直方向修正
    const ratioPlus = this.wyVertical ? 1 - ratio : ratio;
    return ratioPlus * (this.wyMax - this.wyMin) + this.wyMin;
  }

  private getSliderLength(): number {
    return this.wyVertical
      ? this.sliderDom.clientHeight
      : this.sliderDom.clientWidth;
  }

  private getSliderStartPosition(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }
}
