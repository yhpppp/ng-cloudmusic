import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONF } from './services.module';
import { Observable } from 'rxjs';
import { Singer } from './data-types/common.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import queryString from 'query-string';
import { map } from 'rxjs/internal/operators';

interface SingerParams {
  cat?: string;
  offset: number;
  limit: number;
}

const defaultSingerParams: SingerParams = {
  cat: '5001',
  offset: 0,
  limit: 9
};

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONF) private uri: string
  ) {}

  getEnterSinger(
    args: SingerParams = defaultSingerParams
  ): Observable<Singer[]> {
    const params = new HttpParams({ fromString: queryString.stringify(args) });

    return this.http
      .get(this.uri + 'artist/list', { params })
      .pipe(map((res: { artists: Singer[] }) => res.artists));
  }
}
