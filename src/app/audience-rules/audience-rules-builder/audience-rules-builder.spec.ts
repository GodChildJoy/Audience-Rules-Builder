import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudienceRulesApiService } from '../audience-rules-api.service';
import { RuleBuilderService } from '../rule-builder.service';
import { AudienceRulesBuilder } from './audience-rules-builder';

describe('AudienceRulesBuilder', () => {
  let fixture: ComponentFixture<AudienceRulesBuilder>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceRulesBuilder],
      providers: [provideHttpClient(), provideHttpClientTesting(), AudienceRulesApiService, RuleBuilderService],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AudienceRulesBuilder);
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

  it('should render builder heading', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Audience Rules');
  });
});
