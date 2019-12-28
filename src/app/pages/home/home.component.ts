import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Banner } from '../../services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(private homeService: HomeService) {
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
    });
  }

  ngOnInit() {}

  onNzBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
}
