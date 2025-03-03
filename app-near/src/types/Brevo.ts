interface EmailInfo {
  name?: string;
  email: string;
}

interface CommonBrevoBody {
  to?: EmailInfo[];
  sender?: EmailInfo;
  replyTo?: EmailInfo;
  bcc?: EmailInfo[];
  subject?: string;
  templateId?: number;
  params?: Record<string, string>;
}
export interface BrevoBody extends CommonBrevoBody {
  messageVersions?: CommonBrevoBody[];
}
