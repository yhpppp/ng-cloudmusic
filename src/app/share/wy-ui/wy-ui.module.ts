import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../play-count.pipe';
import { WyPlayerComponent } from './wy-player/wy-player.component';
import { WySliderComponent } from './wy-slider/wy-slider.component';
import { WyPlayerModule } from './wy-player/wy-player.module';

@NgModule({
  declarations: [
    SingleSheetComponent,
    PlayCountPipe
    // WyPlayerComponent,
    // WySliderComponent
  ],
  imports: [WyPlayerModule],
  exports: [SingleSheetComponent, PlayCountPipe, WyPlayerModule]
})
export class WyUiModule {}
