interface EmailInfo {
  name?: string;
  email: string;
}
export interface BrevoBody {
  to: EmailInfo[];
  sender?: EmailInfo;
  replyTo?: EmailInfo;
  bcc?: EmailInfo[];
  subject?: string;
  templateId: number;
  params?: Record<string, string>;
}
