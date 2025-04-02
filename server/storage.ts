import {
  users, groups, certificates, permissions, urlRestrictions, timeRestrictions, 
  certificateActions, auditLogs, type User, type Group, type Certificate, 
  type Permission, type UrlRestriction, type TimeRestriction, type CertificateAction, 
  type AuditLog, type InsertUser, type InsertGroup, type InsertCertificate,
  type InsertPermission, type InsertUrlRestriction, type InsertTimeRestriction,
  type InsertCertificateAction, type InsertAuditLog
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Group operations
  getGroup(id: number): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: number, group: Partial<InsertGroup>): Promise<Group | undefined>;
  deleteGroup(id: number): Promise<boolean>;
  getAllGroups(): Promise<Group[]>;
  
  // Certificate operations
  getCertificate(id: number): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  updateCertificate(id: number, certificate: Partial<InsertCertificate>): Promise<Certificate | undefined>;
  deleteCertificate(id: number): Promise<boolean>;
  getAllCertificates(): Promise<Certificate[]>;
  getRecentCertificates(limit: number): Promise<Certificate[]>;
  getCertificatesCount(): Promise<number>;
  getExpiredCertificatesCount(): Promise<number>;
  
  // Permission operations
  getPermission(id: number): Promise<Permission | undefined>;
  getPermissionsByCertificate(certificateId: number): Promise<Permission[]>;
  getPermissionsByGroup(groupId: number): Promise<Permission[]>;
  createPermission(permission: InsertPermission): Promise<Permission>;
  updatePermission(id: number, permission: Partial<InsertPermission>): Promise<Permission | undefined>;
  deletePermission(id: number): Promise<boolean>;
  
  // URL Restriction operations
  getUrlRestriction(id: number): Promise<UrlRestriction | undefined>;
  getUrlRestrictionsByCertificate(certificateId: number): Promise<UrlRestriction[]>;
  createUrlRestriction(restriction: InsertUrlRestriction): Promise<UrlRestriction>;
  updateUrlRestriction(id: number, restriction: Partial<InsertUrlRestriction>): Promise<UrlRestriction | undefined>;
  deleteUrlRestriction(id: number): Promise<boolean>;
  getActiveUrlRestrictionsCount(): Promise<number>;
  
  // Time Restriction operations
  getTimeRestriction(id: number): Promise<TimeRestriction | undefined>;
  getTimeRestrictionsByCertificate(certificateId: number): Promise<TimeRestriction[]>;
  createTimeRestriction(restriction: InsertTimeRestriction): Promise<TimeRestriction>;
  updateTimeRestriction(id: number, restriction: Partial<InsertTimeRestriction>): Promise<TimeRestriction | undefined>;
  deleteTimeRestriction(id: number): Promise<boolean>;
  
  // Certificate Action operations
  getCertificateAction(id: number): Promise<CertificateAction | undefined>;
  getCertificateActionsByCertificate(certificateId: number): Promise<CertificateAction[]>;
  createCertificateAction(action: InsertCertificateAction): Promise<CertificateAction>;
  updateCertificateAction(id: number, action: Partial<InsertCertificateAction>): Promise<CertificateAction | undefined>;
  deleteCertificateAction(id: number): Promise<boolean>;
  
  // Audit Log operations
  getAuditLog(id: number): Promise<AuditLog | undefined>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogsByUser(userId: number): Promise<AuditLog[]>;
  getRecentAuditLogs(limit: number): Promise<AuditLog[]>;
  getAllAuditLogs(): Promise<AuditLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private groups: Map<number, Group>;
  private certificates: Map<number, Certificate>;
  private permissions: Map<number, Permission>;
  private urlRestrictions: Map<number, UrlRestriction>;
  private timeRestrictions: Map<number, TimeRestriction>;
  private certificateActions: Map<number, CertificateAction>;
  private auditLogs: Map<number, AuditLog>;
  
  private userCurrentId: number;
  private groupCurrentId: number;
  private certificateCurrentId: number;
  private permissionCurrentId: number;
  private urlRestrictionCurrentId: number;
  private timeRestrictionCurrentId: number;
  private certificateActionCurrentId: number;
  private auditLogCurrentId: number;

  constructor() {
    this.users = new Map();
    this.groups = new Map();
    this.certificates = new Map();
    this.permissions = new Map();
    this.urlRestrictions = new Map();
    this.timeRestrictions = new Map();
    this.certificateActions = new Map();
    this.auditLogs = new Map();
    
    this.userCurrentId = 1;
    this.groupCurrentId = 1;
    this.certificateCurrentId = 1;
    this.permissionCurrentId = 1;
    this.urlRestrictionCurrentId = 1;
    this.timeRestrictionCurrentId = 1;
    this.certificateActionCurrentId = 1;
    this.auditLogCurrentId = 1;
    
    // Initialize with some demo data
    this.seedDemoData();
  }

  private seedDemoData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In production, this would be hashed
      name: "Admin Demo",
      email: "admin@whomdoc9.com",
      role: "admin",
      avatarUrl: "",
      groupId: null
    });

    // Create groups
    const financeiro = this.createGroup({ name: "Financeiro", description: "Equipe financeira da empresa" });
    const ti = this.createGroup({ name: "TI - Infraestrutura", description: "Time de infraestrutura de TI" });
    const juridico = this.createGroup({ name: "Jurídico", description: "Departamento jurídico" });
    
    // Create certificates
    const now = new Date();
    
    // Certificate 1 - Active
    const cert1 = this.createCertificate({
      name: "SSL Wildcard Acme Corp",
      description: "Certificado SSL para todos os subdomínios da Acme Corp",
      fingerprint: "f1:a2:b3:c4:d5:e6:f7:a8:b9:c0:d1:e2:f3:a4:b5:aa:bb",
      issuedTo: "Financeiro",
      issuedToEmail: "financeiro@acmecorp.com",
      expireAt: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
      type: "SSL/TLS",
      status: "active",
      data: "-----BEGIN CERTIFICATE-----\nMIIDfTCCAmWgAwIBAgIUP6M..."
    });
    
    // Certificate 2 - Active but expiring soon
    const cert2 = this.createCertificate({
      name: "API Gateway Certificate",
      description: "Certificado para API Gateway da empresa",
      fingerprint: "a2:b3:c4:d5:e6:f7:a8:b9:c0:d1:e2:f3:a4:b5:c6:cc:dd",
      issuedTo: "TI - Infraestrutura",
      issuedToEmail: "infra@acmecorp.com",
      expireAt: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate() + 15),
      type: "SSL/TLS",
      status: "active",
      data: "-----BEGIN CERTIFICATE-----\nMIIDfTCCAmWgAwIBAgIUXmM..."
    });
    
    // Certificate 3 - Expired
    const cert3 = this.createCertificate({
      name: "Document Signing Cert",
      description: "Certificado para assinatura de documentos legais",
      fingerprint: "c1:d2:e3:f4:g5:h6:i7:j8:k9:l0:m1:n2:o3:p4:q5:ee:ff",
      issuedTo: "Jurídico",
      issuedToEmail: "juridico@acmecorp.com",
      expireAt: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
      type: "Document Signing",
      status: "expired",
      data: "-----BEGIN CERTIFICATE-----\nMIIDfTCCAmWgAwIBAgIUZnM..."
    });
    
    // Create URL restrictions
    this.createUrlRestriction({ certificateId: cert1.id, pattern: "*.acmecorp.com", isAllowed: true });
    this.createUrlRestriction({ certificateId: cert1.id, pattern: "acmecorp.com", isAllowed: true });
    this.createUrlRestriction({ certificateId: cert1.id, pattern: "internal.acmecorp.com", isAllowed: true });
    
    this.createUrlRestriction({ certificateId: cert2.id, pattern: "api.acmecorp.com", isAllowed: true });
    this.createUrlRestriction({ certificateId: cert2.id, pattern: "api.acmecorp.com/v1/*", isAllowed: true });
    this.createUrlRestriction({ certificateId: cert2.id, pattern: "api.acmecorp.com/v2/*", isAllowed: true });
    this.createUrlRestriction({ certificateId: cert2.id, pattern: "api.acmecorp.com/admin/*", isAllowed: false });
    this.createUrlRestriction({ certificateId: cert2.id, pattern: "api.acmecorp.com/internal/*", isAllowed: false });
    this.createUrlRestriction({ certificateId: cert2.id, pattern: "api.acmecorp.com/public/*", isAllowed: true });
    this.createUrlRestriction({ certificateId: cert2.id, pattern: "api.acmecorp.com/metrics", isAllowed: false });
    this.createUrlRestriction({ certificateId: cert2.id, pattern: "api.acmecorp.com/health", isAllowed: true });
    this.createUrlRestriction({ certificateId: cert2.id, pattern: "api.acmecorp.com/docs", isAllowed: true });
    
    // Create time restrictions
    this.createTimeRestriction({
      certificateId: cert1.id,
      daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
      startTime: "08:00",
      endTime: "18:00",
      timezone: "America/Sao_Paulo"
    });
    
    this.createTimeRestriction({
      certificateId: cert1.id,
      daysOfWeek: [6, 0], // Weekend
      startTime: "10:00",
      endTime: "14:00",
      timezone: "America/Sao_Paulo"
    });
    
    this.createTimeRestriction({
      certificateId: cert2.id,
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // All week
      startTime: "00:00",
      endTime: "23:59",
      timezone: "UTC"
    });
    
    // Create certificate actions
    this.createCertificateAction({ certificateId: cert3.id, action: "sign", isAllowed: true });
    this.createCertificateAction({ certificateId: cert3.id, action: "timestamp", isAllowed: true });
    this.createCertificateAction({ certificateId: cert3.id, action: "encrypt", isAllowed: false });
    this.createCertificateAction({ certificateId: cert3.id, action: "authenticate", isAllowed: true });
    this.createCertificateAction({ certificateId: cert3.id, action: "non-repudiation", isAllowed: true });
    
    // Create permissions
    this.createPermission({ certificateId: cert1.id, groupId: financeiro.id, canView: true, canEdit: true, canDelete: false, canDownload: true });
    this.createPermission({ certificateId: cert2.id, groupId: ti.id, canView: true, canEdit: true, canDelete: true, canDownload: true });
    this.createPermission({ certificateId: cert3.id, groupId: juridico.id, canView: true, canEdit: false, canDelete: false, canDownload: true });
    
    // Create audit logs
    this.createAuditLog({
      userId: 1,
      action: "CREATE",
      resourceType: "CERTIFICATE",
      resourceId: cert1.id,
      details: { name: cert1.name },
      ipAddress: "192.168.1.1"
    });
    
    this.createAuditLog({
      userId: 1,
      action: "CREATE",
      resourceType: "CERTIFICATE",
      resourceId: cert2.id,
      details: { name: cert2.name },
      ipAddress: "192.168.1.1"
    });
    
    this.createAuditLog({
      userId: 1,
      action: "CREATE",
      resourceType: "CERTIFICATE",
      resourceId: cert3.id,
      details: { name: cert3.name },
      ipAddress: "192.168.1.1"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Group operations
  async getGroup(id: number): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const id = this.groupCurrentId++;
    const group: Group = { ...insertGroup, id };
    this.groups.set(id, group);
    return group;
  }

  async updateGroup(id: number, groupData: Partial<InsertGroup>): Promise<Group | undefined> {
    const group = await this.getGroup(id);
    if (!group) return undefined;
    
    const updatedGroup = { ...group, ...groupData };
    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteGroup(id: number): Promise<boolean> {
    return this.groups.delete(id);
  }

  async getAllGroups(): Promise<Group[]> {
    return Array.from(this.groups.values());
  }

  // Certificate operations
  async getCertificate(id: number): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const id = this.certificateCurrentId++;
    const certificate: Certificate = { 
      ...insertCertificate, 
      id, 
      createdAt: new Date()
    };
    this.certificates.set(id, certificate);
    return certificate;
  }

  async updateCertificate(id: number, certificateData: Partial<InsertCertificate>): Promise<Certificate | undefined> {
    const certificate = await this.getCertificate(id);
    if (!certificate) return undefined;
    
    const updatedCertificate = { ...certificate, ...certificateData };
    this.certificates.set(id, updatedCertificate);
    return updatedCertificate;
  }

  async deleteCertificate(id: number): Promise<boolean> {
    return this.certificates.delete(id);
  }

  async getAllCertificates(): Promise<Certificate[]> {
    return Array.from(this.certificates.values());
  }

  async getRecentCertificates(limit: number): Promise<Certificate[]> {
    return Array.from(this.certificates.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getCertificatesCount(): Promise<number> {
    return this.certificates.size;
  }

  async getExpiredCertificatesCount(): Promise<number> {
    const now = new Date();
    return Array.from(this.certificates.values()).filter(
      (cert) => cert.expireAt < now
    ).length;
  }

  // Permission operations
  async getPermission(id: number): Promise<Permission | undefined> {
    return this.permissions.get(id);
  }

  async getPermissionsByCertificate(certificateId: number): Promise<Permission[]> {
    return Array.from(this.permissions.values()).filter(
      (permission) => permission.certificateId === certificateId
    );
  }

  async getPermissionsByGroup(groupId: number): Promise<Permission[]> {
    return Array.from(this.permissions.values()).filter(
      (permission) => permission.groupId === groupId
    );
  }

  async createPermission(insertPermission: InsertPermission): Promise<Permission> {
    const id = this.permissionCurrentId++;
    const permission: Permission = { ...insertPermission, id };
    this.permissions.set(id, permission);
    return permission;
  }

  async updatePermission(id: number, permissionData: Partial<InsertPermission>): Promise<Permission | undefined> {
    const permission = await this.getPermission(id);
    if (!permission) return undefined;
    
    const updatedPermission = { ...permission, ...permissionData };
    this.permissions.set(id, updatedPermission);
    return updatedPermission;
  }

  async deletePermission(id: number): Promise<boolean> {
    return this.permissions.delete(id);
  }

  // URL Restriction operations
  async getUrlRestriction(id: number): Promise<UrlRestriction | undefined> {
    return this.urlRestrictions.get(id);
  }

  async getUrlRestrictionsByCertificate(certificateId: number): Promise<UrlRestriction[]> {
    return Array.from(this.urlRestrictions.values()).filter(
      (restriction) => restriction.certificateId === certificateId
    );
  }

  async createUrlRestriction(insertRestriction: InsertUrlRestriction): Promise<UrlRestriction> {
    const id = this.urlRestrictionCurrentId++;
    const restriction: UrlRestriction = { ...insertRestriction, id };
    this.urlRestrictions.set(id, restriction);
    return restriction;
  }

  async updateUrlRestriction(id: number, restrictionData: Partial<InsertUrlRestriction>): Promise<UrlRestriction | undefined> {
    const restriction = await this.getUrlRestriction(id);
    if (!restriction) return undefined;
    
    const updatedRestriction = { ...restriction, ...restrictionData };
    this.urlRestrictions.set(id, updatedRestriction);
    return updatedRestriction;
  }

  async deleteUrlRestriction(id: number): Promise<boolean> {
    return this.urlRestrictions.delete(id);
  }

  async getActiveUrlRestrictionsCount(): Promise<number> {
    return this.urlRestrictions.size;
  }

  // Time Restriction operations
  async getTimeRestriction(id: number): Promise<TimeRestriction | undefined> {
    return this.timeRestrictions.get(id);
  }

  async getTimeRestrictionsByCertificate(certificateId: number): Promise<TimeRestriction[]> {
    return Array.from(this.timeRestrictions.values()).filter(
      (restriction) => restriction.certificateId === certificateId
    );
  }

  async createTimeRestriction(insertRestriction: InsertTimeRestriction): Promise<TimeRestriction> {
    const id = this.timeRestrictionCurrentId++;
    const restriction: TimeRestriction = { ...insertRestriction, id };
    this.timeRestrictions.set(id, restriction);
    return restriction;
  }

  async updateTimeRestriction(id: number, restrictionData: Partial<InsertTimeRestriction>): Promise<TimeRestriction | undefined> {
    const restriction = await this.getTimeRestriction(id);
    if (!restriction) return undefined;
    
    const updatedRestriction = { ...restriction, ...restrictionData };
    this.timeRestrictions.set(id, updatedRestriction);
    return updatedRestriction;
  }

  async deleteTimeRestriction(id: number): Promise<boolean> {
    return this.timeRestrictions.delete(id);
  }

  // Certificate Action operations
  async getCertificateAction(id: number): Promise<CertificateAction | undefined> {
    return this.certificateActions.get(id);
  }

  async getCertificateActionsByCertificate(certificateId: number): Promise<CertificateAction[]> {
    return Array.from(this.certificateActions.values()).filter(
      (action) => action.certificateId === certificateId
    );
  }

  async createCertificateAction(insertAction: InsertCertificateAction): Promise<CertificateAction> {
    const id = this.certificateActionCurrentId++;
    const action: CertificateAction = { ...insertAction, id };
    this.certificateActions.set(id, action);
    return action;
  }

  async updateCertificateAction(id: number, actionData: Partial<InsertCertificateAction>): Promise<CertificateAction | undefined> {
    const action = await this.getCertificateAction(id);
    if (!action) return undefined;
    
    const updatedAction = { ...action, ...actionData };
    this.certificateActions.set(id, updatedAction);
    return updatedAction;
  }

  async deleteCertificateAction(id: number): Promise<boolean> {
    return this.certificateActions.delete(id);
  }

  // Audit Log operations
  async getAuditLog(id: number): Promise<AuditLog | undefined> {
    return this.auditLogs.get(id);
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = this.auditLogCurrentId++;
    const log: AuditLog = { 
      ...insertLog, 
      id, 
      timestamp: new Date()
    };
    this.auditLogs.set(id, log);
    return log;
  }

  async getAuditLogsByUser(userId: number): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values())
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getRecentAuditLogs(limit: number): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getAllAuditLogs(): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
