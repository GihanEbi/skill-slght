import { Timestamp, UUID } from "./common_types";

// -----------------------------------------------------------------------------
// Enums
//

export enum NotificationChannel {
  InApp = "IN_APP",
  Email = "EMAIL",
  SMS = "SMS",
}

export interface Auth {
  id: UUID;
  user_id: UUID;
  token: string;
  refresh_token: string;
  /** Unique */
  email: string;
  password_hash: string;
  created_by: UUID;
  updated_by: UUID;
}

export interface User {
  id: UUID;
  /** Unique */
  email: string;
  user_group_id: UUID;
  is_active: boolean;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
  /** FK → FileStorage */
  avatar_id: UUID | null;
  email_verified_at: Timestamp | null;
  /** Unique */
  phone_no: string | null;
  is_phone_no_verified: boolean;
  last_login_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID | null;
  updated_by: UUID | null;
}

export interface UserGroup {
  id: UUID;
  group_name: string;
  description: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface AccessRule {
  id: UUID;
  rule_name: string;
  description: string | null;
}

export interface UserGroupRule {
  /** FK → AccessRule (composite PK) */
  rule_id: UUID;
  /** FK → UserGroup (composite PK) */
  user_group_id: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface PasswordReset {
  id: UUID;
  user_id: UUID;
  /** Unique */
  token: string;
  expires_at: Timestamp;
  used_at: Timestamp | null;
  created_at: Timestamp;
}

// -----------------------------------------------------------------------------
// Notifications
// -----------------------------------------------------------------------------

export interface NotificationType {
  id: UUID;
  /** Unique machine key, e.g. "interview_scheduled" */
  type_key: string;
  default_channel: NotificationChannel;
  label: string;
  is_active: boolean;
  /** Material Symbol name or icon URL */
  icon: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface Notification {
  id: UUID;
  recipient_id: UUID;
  /** null when sent by the system */
  sender_id: UUID | null;
  type_id: UUID;
  title: string;
  channel: NotificationChannel;
  body: string;
  action_url: string | null;
  /** Polymorphic: name of the related table, e.g. "candidate_jobs" */
  entity_type: string | null;
  /** Polymorphic: ID of the related record */
  entity_id: UUID | null;
  is_read: boolean;
  read_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface NotificationPreference {
  id: UUID;
  user_id: UUID;
  type_id: UUID;
  in_app_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface AuditLog {
  id: UUID;
  /** e.g. "CREATE" | "UPDATE" | "DELETE" */
  action: string;
  /** Name of the affected table */
  entity_type: string;
  entity_id: UUID;
  /** JSON snapshot before the change */
  old_value: Record<string, unknown> | null;
  /** JSON snapshot after the change */
  new_value: Record<string, unknown> | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}
