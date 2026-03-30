import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudienceRulesApiService } from '../audience-rules-api.service';
import { AudienceRulesList } from './audience-rules-list';

describe('AudienceRulesList', () => {
  let fixture: ComponentFixture<AudienceRulesList>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceRulesList],
      providers: [provideHttpClient(), provideHttpClientTesting(), AudienceRulesApiService],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AudienceRulesList);
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:3000/rules');
    expect(req.request.method).toBe('GET');
    req.flush([]);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show empty state after loading', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('No saved rules yet');
  });
});
