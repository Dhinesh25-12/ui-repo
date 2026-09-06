import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { PlatformSettings } from './platform-settings';
import { SettingsService } from '../../../core/services/settings.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PlatformSetting } from '../../../core/models/setting.model';

const EDITABLE: PlatformSetting = {
  key: 'policies.default-tenure-months-override',
  value: '12',
  description: 'Default tenure override',
  editable: true
};
const READ_ONLY: PlatformSetting = { key: 'jwt.expiration-minutes', value: '60', editable: false };

describe('PlatformSettings', () => {
  let settingsServiceStub: {
    getSettings: ReturnType<typeof vi.fn>;
    updateSetting: ReturnType<typeof vi.fn>;
  };
  let notificationsStub: { success: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    settingsServiceStub = { getSettings: vi.fn(), updateSetting: vi.fn() };
    notificationsStub = { success: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PlatformSettings],
      providers: [
        { provide: SettingsService, useValue: settingsServiceStub },
        { provide: NotificationService, useValue: notificationsStub }
      ]
    }).compileComponents();
  });

  function createLoaded(settings: PlatformSetting[]): PlatformSettings {
    settingsServiceStub.getSettings.mockReturnValue(of(settings));
    const component = TestBed.createComponent(PlatformSettings).componentInstance;
    component.ngOnInit();
    return component;
  }

  it('clears the loading state and seeds drafts from the loaded values', () => {
    const component = createLoaded([EDITABLE, READ_ONLY]);

    expect(component.loading()).toBe(false);
    expect(component.draftValue(EDITABLE)).toBe('12');
    expect(component.isDirty(EDITABLE)).toBe(false);
    expect(component.canSave(EDITABLE)).toBe(false);
  });

  it('coerces numeric input values to strings and enables saving when changed', () => {
    const component = createLoaded([EDITABLE]);
    component.onDraftChange(EDITABLE, 24);

    expect(component.draftValue(EDITABLE)).toBe('24');
    expect(component.isDirty(EDITABLE)).toBe(true);
    expect(component.canSave(EDITABLE)).toBe(true);
  });

  it('does not allow saving a blank value', () => {
    const component = createLoaded([EDITABLE]);
    component.onDraftChange(EDITABLE, '   ');

    expect(component.canSave(EDITABLE)).toBe(false);
  });

  it('never allows saving a read-only setting', () => {
    const component = createLoaded([READ_ONLY]);
    component.onDraftChange(READ_ONLY, '90');

    component.save(READ_ONLY);

    expect(component.canSave(READ_ONLY)).toBe(false);
    expect(settingsServiceStub.updateSetting).not.toHaveBeenCalled();
  });

  it('stores the updated setting and notifies on success', () => {
    const component = createLoaded([EDITABLE]);
    settingsServiceStub.updateSetting.mockReturnValue(of({ ...EDITABLE, value: '24' }));

    component.onDraftChange(EDITABLE, '24');
    component.save(EDITABLE);

    expect(settingsServiceStub.updateSetting).toHaveBeenCalledWith(EDITABLE.key, '24');
    expect(component.savingKey()).toBeNull();
    expect(component.settings()[0].value).toBe('24');
    expect(component.isDirty(component.settings()[0])).toBe(false);
    expect(notificationsStub.success).toHaveBeenCalled();
  });

  it('restores the saved value and clears the saving state on error', () => {
    const component = createLoaded([EDITABLE]);
    settingsServiceStub.updateSetting.mockReturnValue(throwError(() => new Error('not editable')));

    component.onDraftChange(EDITABLE, '24');
    component.save(EDITABLE);

    expect(component.savingKey()).toBeNull();
    expect(component.draftValue(EDITABLE)).toBe('12');
  });
});
