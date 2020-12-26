import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class JQueryService {

  constructor() { }

  initTooltips() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
  })
  }

  hideModal(id: string) {
    $(`#${id}`).modal('hide');
  }

  toast(id: string, delay: number = 2000) {
    $(`#${id}`).toast({delay: delay});
    $(`#${id}`).toast('show');
  }
}
