import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { HttpEvent, HttpRequest, HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { attrToBoolean } from '../../utils';

@Component({
  selector: 'ui-input[type=file]',
  templateUrl: './file.component.html'
})
export class FileComponent {
  @Output() uiChange = new EventEmitter<any>();
  @Output() uiUploadStart = new EventEmitter<void>();
  @Output() uiUploading = new EventEmitter<number>();
  @Output() uiUploaded = new EventEmitter<any>();
  @Output() uiUploadError = new EventEmitter<Error>();
  @Input() placeholder = '上传文件';
  @Input() ext: string | RegExp | Array<string | RegExp> = '';
  @Input() name: string;
  @Input() forId: string;
  @Input() accept: string;
  @Input() uploader: (data: FormData) => (HttpRequest<any> | Observable<HttpEvent<any>>);

  @HostBinding('class.ui-focus')
  set focus(v: boolean) {
    this._focus = attrToBoolean(v);
  }

  get focus() {
    return this._focus;
  }

  @Input()
  set disabled(v: boolean) {
    this._disabled = attrToBoolean(v);
  }

  get disabled() {
    return this._disabled;
  }

  @Input()
  set readonly(v: boolean) {
    this._readonly = attrToBoolean(v);
  }

  get readonly() {
    return this._readonly;
  }

  @Input()
  set multiple(v: boolean) {
    this._multiple = attrToBoolean(v);
  }

  get multiple() {
    return this._multiple;
  }

  isShowLoading = false;
  progress = 0;
  refreshState = true;

  private _multiple = false;
  private _disabled = false;
  private _readonly = false;
  private _focus = false;

  constructor(private http: HttpClient) {
  }

  selectedFiles(event: any) {
    this.progress = 0;
    this.uiChange.emit(event);
    const data = new FormData();
    const files = event.target.files;
    if (!files.length) {
      return;
    }

    const validators: RegExp[] = [];
    if (this.ext) {
      let ext: Array<RegExp | string>;
      if (!Array.isArray(this.ext)) {
        ext = [this.ext];
      }
      ext.forEach(item => {
        if (typeof item === 'string') {
          validators.push(new RegExp(`(${item})$`, 'i'));
        } else if (item instanceof RegExp) {
          validators.push(item);
        }
      });
    }

    for (const file of files) {
      const ext = (file.name.match(/\.\w+$/) || ['.'])[0].substring(1);
      if (this.validate(ext, validators)) {
        data.append(this.name, file);
      } else {
        this.uiUploadError.emit(new Error(`不支持 "${file.name}" 上传`));
        return;
      }
    }
    if (typeof this.uploader === 'function') {
      const request = this.uploader(data);
      if (request instanceof HttpRequest) {
        this.upload(this.http.request(request));
      } else if (request instanceof Observable) {
        this.upload(request);
      }
    }
    this.refresh();
  }

  private validate(ext: string, validators: RegExp[]) {
    for (const item of validators) {
      if (!item.test(ext)) {
        return false;
      }
    }
    return true;
  }

  private upload(obs: Observable<HttpEvent<any>>) {
    this.isShowLoading = true;
    obs.pipe(filter((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.uiUploadStart.emit();
          return false;
        case HttpEventType.UploadProgress:
          const percentDone = Math.floor(100 * event.loaded / event.total);
          this.progress = percentDone;
          this.uiUploading.emit(percentDone);
          return false;
        case HttpEventType.Response:
          return true;
        default:
          return false;
      }
    })).pipe(map(response => {
      if (response instanceof HttpResponse) {
        return response.body;
      }
      return response;
    })).subscribe(response => {
      this.progress = 100;
      this.isShowLoading = false;
      // this.refresh();
      this.uiUploaded.emit(response);
    }, error => {
      this.progress = 0;
      this.isShowLoading = false;
      // this.refresh();
      this.uiUploadError.emit(error);
    });
  }

  private refresh() {
    this.refreshState = false;
    setTimeout(() => {
      this.refreshState = true;
    });
  }
}
