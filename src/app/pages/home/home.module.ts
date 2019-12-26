import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ShareModule } from '../../share/share.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [ShareModule, HomeRoutingModule]
})
export class HomeModule {}
