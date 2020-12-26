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
}
