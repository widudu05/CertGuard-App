// Dashboard types
export interface StatusCardProps {
  icon: string;
  title: string;
  value: string | number;
  color: 'primary' | 'secondary' | 'amber' | 'red';
  trend?: string;
  trendDirection?: 'up' | 'down' | 'warning';
}

export interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  additionalContent?: React.ReactNode;
}

export interface RecentActivityItem {
  id: number;
  user: {
    id: number;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  action: string;
  actionDetail: string;
  certificate: string;
  timestamp: string;
  status: 'Permitido' | 'Bloqueado';
}

export interface SecurityMetric {
  name: string;
  value: number;
  label: string;
  color: 'red' | 'amber' | 'green' | 'primary' | 'secondary';
}

export interface SecurityRecommendation {
  type: 'warning' | 'info';
  text: string;
}

// Certificate types
export interface Certificate {
  id: number;
  name: string;
  type: string;
  issuedAt: string;
  expiresAt: string;
  createdBy: number;
  allowedActions: string[];
}

export interface CertificateFormValues {
  name: string;
  type: string;
  userGroup: string;
  expiresAt: string;
  allowedActions: {
    signing: boolean;
    authentication: boolean;
    encryption: boolean;
  };
}

// User and Group types
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface UserGroup {
  id: number;
  name: string;
  description?: string;
}

// Access Policy types
export interface AccessPolicy {
  id: number;
  name: string;
  description?: string;
  allowedSystems?: string[];
  blockedUrls?: string[];
  allowedUrls?: string[];
  sensitiveInfoRules?: any[];
  accessHours?: {
    workDays: boolean;
    weekend: boolean;
    startTime: string;
    endTime: string;
  };
}

// Audit Log types
export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  certificateId?: number;
  details: any;
  status: string;
  timestamp: string;
}
