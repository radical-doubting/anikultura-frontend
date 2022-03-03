import {
  ComponentFixture,
  TestBed,
  getTestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let injector: TestBed;
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let httpMock: HttpTestingController;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HomePage],
        imports: [
          IonicModule.forRoot(),
          ExploreContainerComponentModule,
          ReactiveFormsModule,
          HttpClientTestingModule,
        ],
      }).compileComponents();

      injector = getTestBed();
      httpMock = injector.inject(HttpTestingController);

      fixture = TestBed.createComponent(HomePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
