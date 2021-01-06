import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class JQueryService {

  constructor() { }

  // Still working on this
  initTooltips() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  hideModal(id: string) {
    $(`#${id}`).modal('hide');
  }

  onModalHide(id: string, onModalHideActions: { (): void; }) {
    $(`#${id}`).on('hidden.bs.modal', function (e) {
      onModalHideActions();
      $('.error-msg').empty();
    })
  }

  toast(id: string, delay: number = 2000) {
    $(`#${id}`).toast({delay: delay});
    $(`#${id}`).toast('show');
  }
}
