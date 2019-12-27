import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONF } from './services.module';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Banner } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONF) private uri: string
  ) {}

  getBanners(): Observable<Banner[]> {
    return this.http
      .get(this.uri + 'banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }
}
