import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Banner } from '../../services/data-types/common.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners: Banner[];
  constructor(private homeService: HomeService) {
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
    });
  }

  ngOnInit() {}
}
