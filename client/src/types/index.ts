export interface NavItem {
  title: string;
  icon: string;
  href: string;
  section?: string;
}

export interface CertificateWithRestrictions {
  id: number;
  name: string;
  description: string | null;
  fingerprint: string;
  issuedTo: string;
  issuedToEmail: string;
  expireAt: Date;
  type: string;
  status: string;
  createdAt: Date;
  data: string;
  urlRestrictions: number;
  timeRestrictions: number;
  groupRestrictions: number;
  actions: number;
}

export interface DashboardStats {
  certificatesCount: number;
  groupsCount: number;
  expiredCertificatesCount: number;
  urlRestrictionsCount: number;
}

export interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  benefits: string[];
  buttonText: string;
}
