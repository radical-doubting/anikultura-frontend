import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { FarmerReportPhoto } from '../types/farmer-report.type';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private currentPhoto = new BehaviorSubject<FarmerReportPhoto>(null);

  constructor() {}

  public getCurrentPhoto(): Observable<FarmerReportPhoto> {
    return this.currentPhoto.asObservable();
  }

  public async takeNewPhoto() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.clearPhoto();

    this.currentPhoto.next({
      filePath: null,
      dataUrl: capturedPhoto.dataUrl,
    });
  }

  public clearPhoto() {
    this.currentPhoto.next(null);
  }
}
