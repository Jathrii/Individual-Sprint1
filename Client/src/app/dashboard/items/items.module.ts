import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ItemsRoutingModule } from './items-routing.module';

import { ItemsComponent } from './items.component';
import { StoreComponent } from './store/store.component';
import { ProductService } from '../../product.service';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@NgModule({
  imports: [ThemeModule, ItemsRoutingModule],
  declarations: [ItemsComponent, StoreComponent],
  providers: [ProductService, DatePipe, CurrencyPipe]
})
export class ItemsModule { }
