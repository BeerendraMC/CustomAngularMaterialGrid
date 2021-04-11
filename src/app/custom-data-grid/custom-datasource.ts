import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

export class CustomDataSource<T> implements DataSource<T> {
  private dataSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private showNoDataMessageSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public showNoDataMessage$ = this.showNoDataMessageSubject.asObservable();

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
    this.showNoDataMessageSubject.complete();
  }

  setDataSubject(data: T[]): void {
    this.dataSubject.next(data);
  }

  setLoadingSubject(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  setShowNoDataMessageSubject(showMessage: boolean): void {
    this.showNoDataMessageSubject.next(showMessage);
  }
}
