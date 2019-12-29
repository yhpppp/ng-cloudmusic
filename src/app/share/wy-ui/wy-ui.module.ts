import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../play-count.pipe';
import { WyPlayerComponent } from './wy-player/wy-player.component';

@NgModule({
  declarations: [SingleSheetComponent, PlayCountPipe, WyPlayerComponent],
  imports: [CommonModule],
  exports: [SingleSheetComponent, PlayCountPipe, WyPlayerComponent]
})
export class WyUiModule {}
