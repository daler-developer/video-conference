import { IRule } from '@/application/IRule';
import { Conference } from '@/domain';

export class ConferenceShouldExistRule extends IRule {
  constructor(private conference?: Conference | null) {
    super();
  }

  async check() {
    if (!this.conference) {
      return this.error('NOT_FOUND', 'Conference not found');
    }
  }
}
