import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySliderComponent } from './wy-slider.component';
import { WySliderHandleComponent } from './components/wy-slider-handle.component';
import { WySliderTrackComponent } from './components/wy-slider-track.component';

@NgModule({
  declarations: [
    WySliderComponent,
    WySliderTrackComponent,
    WySliderHandleComponent
  ],
  imports: [CommonModule],
  exports: [WySliderComponent]
})
export class WySliderModule {}
