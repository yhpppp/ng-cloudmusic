import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .wy-scroll {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  private bs: BScroll;

  @Input() private data: [];

  constructor() {}

  // 重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
  private refresh() {
    console.log('refreshed :) ');
    this.bs.refresh();
  }

  // 等待列表数据加载完成后刷新
  asyncRefresh() {
    setTimeout(() => {
      this.refresh();
    }, 50);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const target = 'data';
    if (changes[target]) {
      console.log('数据刷新时... ', this.wrapRef.nativeElement.offsetHeight);
      this.asyncRefresh();
    }
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Init
    // 初始化后offsetHeight为0,需要更新组件
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        fade: false, // 当滚动停止的时候，滚动条渐隐
        interactive: true // 滚动条是否可以交互
      },
      mouseWheel: {}
    });
  }
}
