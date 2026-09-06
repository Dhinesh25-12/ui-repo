import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';
import { PlatformSetting } from '../../../core/models/setting.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-platform-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner, EmptyState],
  templateUrl: './platform-settings.html',
  styleUrl: './platform-settings.scss'
})
export class PlatformSettings implements OnInit {
  readonly loading = signal(true);
  readonly settings = signal<PlatformSetting[]>([]);
  /** Pending (unsaved) values keyed by setting key, for editable settings only. */
  readonly drafts = signal<Record<string, string>>({});
  /** Key of the setting whose update is currently in flight, if any. */
  readonly savingKey = signal<string | null>(null);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        this.settings.set(settings);
        this.resetDrafts(settings);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  draftValue(setting: PlatformSetting): string {
    return this.drafts()[setting.key] ?? setting.value;
  }

  onDraftChange(setting: PlatformSetting, value: string): void {
    this.drafts.update((drafts) => ({ ...drafts, [setting.key]: value }));
  }

  /** Numeric settings get a number input; everything else falls back to plain text. */
  isNumeric(setting: PlatformSetting): boolean {
    return setting.value.trim().length > 0 && !Number.isNaN(Number(setting.value.trim()));
  }

  isDirty(setting: PlatformSetting): boolean {
    return this.draftValue(setting) !== setting.value;
  }

  canSave(setting: PlatformSetting): boolean {
    return (
      setting.editable &&
      this.savingKey() === null &&
      this.isDirty(setting) &&
      this.draftValue(setting).trim().length > 0
    );
  }

  save(setting: PlatformSetting): void {
    if (!this.canSave(setting)) return;

    const value = this.draftValue(setting).trim();
    this.savingKey.set(setting.key);
    this.settingsService.updateSetting(setting.key, value).subscribe({
      next: (updated) => {
        this.settings.update((current) => current.map((s) => (s.key === updated.key ? updated : s)));
        this.drafts.update((drafts) => ({ ...drafts, [updated.key]: updated.value }));
        this.savingKey.set(null);
        this.notifications.success(`Updated "${updated.key}".`);
      },
      error: () => {
        // The global error interceptor shows the message; restore the saved value
        // so the row doesn't look stuck in a failed state.
        this.drafts.update((drafts) => ({ ...drafts, [setting.key]: setting.value }));
        this.savingKey.set(null);
      }
    });
  }

  private resetDrafts(settings: PlatformSetting[]): void {
    const drafts: Record<string, string> = {};
    for (const setting of settings) {
      drafts[setting.key] = setting.value;
    }
    this.drafts.set(drafts);
  }
}
