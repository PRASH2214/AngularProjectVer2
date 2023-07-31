//import { Pipe, PipeTransform } from '@angular/core';

//@Pipe({
//  name: 'filter'
//})
//export class FilterPipe implements PipeTransform {
//  transform(arr: any, filters: any) {
//    return arr.filter(item => {
//      return (filters.varCFACode ? item.varCFACode.indexOf(filters.varCFACode) >= 0 : true) ||
//        (filters.varCFAName ? item.varCFAName.indexOf(filters.varCFAName) >= 0 : true);
//    });
//  }
//}


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false

})
export class FilterPipe implements PipeTransform {
  transform(items: any, filter: any, defaultFilter: boolean): any {
    if (!filter) {
      return items;
    }

    if (!Array.isArray(items)) {
      return items;
    }

    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);

      if (defaultFilter) {
        return items.filter(item => {
          return filterKeys.reduce((x, keyName) => {
            if (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) {
              Object.assign(item, { isfilter: true })
            }
            else {
              Object.assign(item, { isfilter: false })
            }
            return x && new RegExp(filter[keyName], 'gi').test(item[keyName])
          }, true)
        });
      }
      else {
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            if (new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "") {
              Object.assign(item, { isfilter: true })
            }
            else {
              Object.assign(item, { isfilter: false })
            }
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
          });
        });
      }
    }
  }
}
