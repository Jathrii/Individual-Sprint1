import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ProductService } from '../../../product.service'
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styles: [`
    nb-card {
     transform: translate3d(0, 0, 0);
    }
  `]
})
export class StoreComponent implements OnInit {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string'
      },
      price: {
        title: 'Price',
        type: 'number',
        valuePrepareFunction: (price) => {
          var formatted = this.currencyPipe.transform(price);
          return formatted; 
        }
      },
      createdAt: {
        title: 'Creation Date',
        type: 'string',
        valuePrepareFunction: (date) => {
          var raw = new Date(date);
          var formatted = this.datePipe.transform(raw, 'dd MMM yyyy');
          return formatted; 
        }
      },
      updatedAt: {
        title: 'Last Modified',
        type: 'string',
        valuePrepareFunction: (date) => {
          if (!date)
            return 'N/A';
          var raw = new Date(date);
          var formatted = this.datePipe.transform(raw, 'dd MMM yyyy');
          return formatted; 
        }
      },
      sellerName: {
        title: 'Seller Name',
        type: 'string'
      }
    },
  }

  source: any;

  constructor(private productService: ProductService, private datePipe: DatePipe, private currencyPipe: CurrencyPipe) {
    this.source = [];
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(res => this.source = res.data);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
