import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsComponent } from './items.component';
import { StoreComponent } from './store/store.component';


const routes: Routes = [
  {
    path: '',
    component: ItemsComponent,
    children: [
      {
        path: 'store',
        component: StoreComponent
      },
      {
        path: '',
        redirectTo: 'store',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
