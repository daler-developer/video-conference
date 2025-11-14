import { IRule } from '@/application/IRule';

export class SessionRequiredRule extends IRule {
  async check() {
    if (!this.ctx.currentUserId) {
      return this.error('SESSION_REQUIRED', 'Session required for this action');
    }
  }
}
