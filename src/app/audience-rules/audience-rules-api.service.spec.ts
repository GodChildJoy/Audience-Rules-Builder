import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AudienceRulesApiService } from './audience-rules-api.service';

describe('AudienceRulesApiService', () => {
  let service: AudienceRulesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AudienceRulesApiService],
    });
    service = TestBed.inject(AudienceRulesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET /rules and return saved rules', () => {
    const mock = [
      {
        id: 'a',
        name: 'Audience Rule x',
        root: { logic: 'AND' as const, conditions: [], groups: [] },
        savedAt: '2024-01-01T00:00:00.000Z',
        storedAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    service.listRules().subscribe((rules) => {
      expect(rules).toEqual(mock);
    });
    const req = httpMock.expectOne('http://localhost:3000/rules');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should emit error when server is down (connection failed / status 0)', () => {
    return new Promise<void>((resolve, reject) => {
      service.listRules().subscribe({
        next: () => reject(new Error('expected subscriber error, not success')),
        error: (err: { status?: number }) => {
          expect(err.status).toBe(0);
          resolve();
        },
      });
      const req = httpMock.expectOne('http://localhost:3000/rules');
      req.flush(null, { status: 0, statusText: 'Unknown Error' });
    });
  });

  it('should bump savedRulesListVersion when notifyRuleSaved is called', () => {
    expect(service.savedRulesListVersion()).toBe(0);
    service.notifyRuleSaved();
    expect(service.savedRulesListVersion()).toBe(1);
    service.notifyRuleSaved();
    expect(service.savedRulesListVersion()).toBe(2);
  });
});
