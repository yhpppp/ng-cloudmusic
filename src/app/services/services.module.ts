import { NgModule, InjectionToken } from '@angular/core';

export const API_CONF = new InjectionToken('ApiConfigToken');
@NgModule({
  declarations: [],
  imports: [],
  providers: [{ provide: API_CONF, useValue: 'http://localhost:3000/' }]
})
export class ServicesModule {}
