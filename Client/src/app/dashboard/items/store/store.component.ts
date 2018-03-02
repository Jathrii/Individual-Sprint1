import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ProductService } from '../../../product.service'
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { UserService } from '../../../user.service';


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
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
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
      sellerName: {
        title: 'Seller Name',
        type: 'string'
      },
      createdAt: {
        title: 'Creation Date',
        type: 'string',
        valuePrepareFunction: (date) => {
          if (!date)
            return 'N/A';
          var raw = new Date(date);
          var formatted = this.datePipe.transform(raw, 'dd MMM yyyy');
          return formatted;
        },
        editable: false
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
        },
        editable: false
      }
    }
  }

  source: any;

  constructor(private productService: ProductService, private userService: UserService, private datePipe: DatePipe, private currencyPipe: CurrencyPipe) {
    this.source = [];
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(res => this.source = res.data);
    var user = this.userService.getUser();
    if (!user)
      return;
    if (user.userType == 'admin') {
      this.settings.actions.add = true;
      this.settings.actions.edit = true;
      this.settings.actions.delete = true;
    }
    else if (user.userType == 'manager') {
      this.settings.actions.add = true;
      this.settings.actions.edit = true;
      this.settings.actions.delete = false;
    }
    else if (user.userType == 'viewer') {
      this.settings.actions.add = false;
      this.settings.actions.edit = false;
      this.settings.actions.delete = false;
    }
  }

  onCreateConfirm(event): void {
    if (isNaN(event.newData.price)) {
      event.confirm.reject();
      window.alert('Price must a number!');
      return;
    }

    event.newData.name = event.newData.name.toLowerCase();

    if (window.confirm(
      'Name: ' + event.newData.name +
      '\nPrice: ' + this.currencyPipe.transform(event.newData.price) +
      '\nSeller Name: ' + event.newData.sellerName +
      '\nCreate product?'
    )) {
      delete event.newData.createdAt;
      delete event.newData.updatedAt;
      this.productService.createProduct(event.newData).subscribe(function (res) {
        if (res.err) {
          event.confirm.reject();
          window.alert('Couldn\'t create product!\nServer returned:\n' + res.err);
        }
        else if (res.msg == 'Product was created successfully.') {
          event.confirm.resolve(res.data);
          window.alert(res.msg);
        }
        else {
          event.confirm.reject();
          window.alert('Couldn\'t create product!\nInternal error code: 1.');
        }
      });
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    if (isNaN(event.newData.price)) {
      event.confirm.reject();
      window.alert('Price must a number!');
      return;
    }

    event.newData.name = event.newData.name.toLowerCase();

    if (window.confirm(
      'Name: ' + event.data.name + ' -> ' + event.newData.name +
      '\nPrice: ' + this.currencyPipe.transform(event.data.price) + ' -> ' + this.currencyPipe.transform(event.newData.price) +
      '\nSeller Name: ' + event.data.sellerName + ' -> ' + event.newData.sellerName +
      '\nUpdate product?'
    )) {
      this.productService.updateProduct(event.newData).subscribe(function (res) {
        if (res.err) {
          event.confirm.reject();
          window.alert('Couldn\'t update product!\nServer returned:\n' + res.err);
        }
        else if (res.msg == 'productId parameter must be a valid ObjectId.') {
          event.confirm.reject();
          window.alert('Couldn\'t update product!\nInternal error code: 0.');
        }
        else if (res.msg == 'Product not found.') {
          event.confirm.reject();
          window.alert(res.msg);
        }
        else if (res.msg == 'Product was updated successfully.') {
          event.confirm.resolve(res.data);
          window.alert(res.msg);
        }
        else {
          event.confirm.reject();
          window.alert('Couldn\'t update product!\nInternal error code: 1.');
        }
      })
    } else {
      event.confirm.reject();
    }
  }

  onDeleteConfirm(event): void {
    if (window.confirm(
      'Name: ' + event.data.name +
      '\nPrice: ' + this.currencyPipe.transform(event.data.price) +
      '\nSeller Name: ' + event.data.sellerName +
      '\nDelete product?'
    )) {
      this.productService.deleteProduct(event.data._id).subscribe(function (res) {
        if (res.err) {
          event.confirm.reject();
          window.alert('Couldn\'t delete product!\nServer returned:\n' + res.err);
        }
        else if (res.msg == 'productId parameter must be a valid ObjectId.') {
          event.confirm.reject();
          window.alert('Couldn\'t delete product!\nInternal error code: 0.');
        }
        else if (res.msg == 'Product not found.') {
          event.confirm.resolve();
          window.alert('Product already deleted!');
        }
        else if (res.msg == 'Product was deleted successfully.') {
          event.confirm.resolve();
          window.alert(res.msg);
        }
        else {
          window.alert('Couldn\'t delete product!\nInternal error code: 1.');
          event.confirm.reject();
        }
      })
    } else {
      event.confirm.reject();
    }
  }

}
