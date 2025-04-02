import {
  users, userGroups, userToGroup, certificates, accessPolicies,
  certificateToPolicy, certificateToGroup, auditLogs, schedules,
  type User, type InsertUser, type UserGroup, type InsertUserGroup,
  type UserToGroup, type InsertUserToGroup, type Certificate, type InsertCertificate,
  type AccessPolicy, type InsertAccessPolicy, type CertificateToPolicy, type InsertCertificateToPolicy,
  type CertificateToGroup, type InsertCertificateToGroup, type AuditLog, type InsertAuditLog,
  type Schedule, type InsertSchedule
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  
  // User Group operations
  getUserGroup(id: number): Promise<UserGroup | undefined>;
  getUserGroupByName(name: string): Promise<UserGroup | undefined>;
  createUserGroup(group: InsertUserGroup): Promise<UserGroup>;
  updateUserGroup(id: number, group: Partial<InsertUserGroup>): Promise<UserGroup | undefined>;
  deleteUserGroup(id: number): Promise<boolean>;
  listUserGroups(): Promise<UserGroup[]>;
  
  // User to Group mapping
  addUserToGroup(mapping: InsertUserToGroup): Promise<UserToGroup>;
  removeUserFromGroup(userId: number, groupId: number): Promise<boolean>;
  getUserGroups(userId: number): Promise<UserGroup[]>;
  getUsersInGroup(groupId: number): Promise<User[]>;
  
  // Certificate operations
  getCertificate(id: number): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  updateCertificate(id: number, certificate: Partial<InsertCertificate>): Promise<Certificate | undefined>;
  deleteCertificate(id: number): Promise<boolean>;
  listCertificates(): Promise<Certificate[]>;
  
  // Access Policy operations
  getAccessPolicy(id: number): Promise<AccessPolicy | undefined>;
  createAccessPolicy(policy: InsertAccessPolicy): Promise<AccessPolicy>;
  updateAccessPolicy(id: number, policy: Partial<InsertAccessPolicy>): Promise<AccessPolicy | undefined>;
  deleteAccessPolicy(id: number): Promise<boolean>;
  listAccessPolicies(): Promise<AccessPolicy[]>;
  
  // Certificate to Policy mapping
  assignPolicyToCertificate(mapping: InsertCertificateToPolicy): Promise<CertificateToPolicy>;
  removePolicyFromCertificate(certificateId: number, policyId: number): Promise<boolean>;
  getCertificatePolicies(certificateId: number): Promise<AccessPolicy[]>;
  
  // Certificate to Group mapping
  assignCertificateToGroup(mapping: InsertCertificateToGroup): Promise<CertificateToGroup>;
  removeCertificateFromGroup(certificateId: number, groupId: number): Promise<boolean>;
  getGroupCertificates(groupId: number): Promise<Certificate[]>;
  
  // Audit Log operations
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  listAuditLogs(limit?: number): Promise<AuditLog[]>;
  getAuditLogsByUser(userId: number): Promise<AuditLog[]>;
  getAuditLogsByCertificate(certificateId: number): Promise<AuditLog[]>;
  
  // Schedule operations
  getSchedule(id: number): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: number, schedule: Partial<InsertSchedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: number): Promise<boolean>;
  listSchedules(): Promise<Schedule[]>;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private userGroupsData: Map<number, UserGroup>;
  private userToGroupData: Map<number, UserToGroup>;
  private certificatesData: Map<number, Certificate>;
  private accessPoliciesData: Map<number, AccessPolicy>;
  private certificateToPolicyData: Map<number, CertificateToPolicy>;
  private certificateToGroupData: Map<number, CertificateToGroup>;
  private auditLogsData: Map<number, AuditLog>;
  private schedulesData: Map<number, Schedule>;
  
  private userIdCounter: number;
  private userGroupIdCounter: number;
  private userToGroupIdCounter: number;
  private certificateIdCounter: number;
  private accessPolicyIdCounter: number;
  private certificateToPolicyIdCounter: number;
  private certificateToGroupIdCounter: number;
  private auditLogIdCounter: number;
  private scheduleIdCounter: number;
  
  constructor() {
    this.usersData = new Map();
    this.userGroupsData = new Map();
    this.userToGroupData = new Map();
    this.certificatesData = new Map();
    this.accessPoliciesData = new Map();
    this.certificateToPolicyData = new Map();
    this.certificateToGroupData = new Map();
    this.auditLogsData = new Map();
    this.schedulesData = new Map();
    
    this.userIdCounter = 1;
    this.userGroupIdCounter = 1;
    this.userToGroupIdCounter = 1;
    this.certificateIdCounter = 1;
    this.accessPolicyIdCounter = 1;
    this.certificateToPolicyIdCounter = 1;
    this.certificateToGroupIdCounter = 1;
    this.auditLogIdCounter = 1;
    this.scheduleIdCounter = 1;
    
    // Initialize with some demo data
    this.initDemoData();
  }
  
  // Initialize demo data
  private initDemoData() {
    // Demo users
    const admin = this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "Carlos Silva",
      email: "admin@example.com",
      role: "administrator",
      avatarUrl: "",
      isActive: true
    });
    
    const dev = this.createUser({
      username: "dev",
      password: "dev123",
      fullName: "Marcos Oliveira",
      email: "dev@example.com",
      role: "developer",
      avatarUrl: "",
      isActive: true
    });
    
    const finance = this.createUser({
      username: "finance",
      password: "finance123",
      fullName: "Ana Ferreira",
      email: "finance@example.com",
      role: "finance",
      avatarUrl: "",
      isActive: true
    });
    
    // Demo groups
    const adminGroup = this.createUserGroup({
      name: "Administradores",
      description: "Grupo de administradores do sistema"
    });
    
    const devGroup = this.createUserGroup({
      name: "Equipe de Desenvolvimento",
      description: "Desenvolvedores de software"
    });
    
    const financeGroup = this.createUserGroup({
      name: "Equipe Financeira",
      description: "Equipe financeira da empresa"
    });
    
    // Add users to groups
    this.addUserToGroup({
      userId: admin.id,
      groupId: adminGroup.id
    });
    
    this.addUserToGroup({
      userId: dev.id,
      groupId: devGroup.id
    });
    
    this.addUserToGroup({
      userId: finance.id,
      groupId: financeGroup.id
    });
    
    // Demo policies
    const defaultPolicy = this.createAccessPolicy({
      name: "Política Padrão",
      description: "Política padrão para certificados",
      allowedSystems: ["sistema1", "sistema2"],
      blockedUrls: ["*.external-domain.com/*"],
      allowedUrls: ["*.company-domain.com/secure/*"],
      sensitiveInfoRules: [{ field: "cpf", maskType: "partial" }],
      accessHours: {
        workDays: true,
        weekend: false,
        startTime: "08:00",
        endTime: "18:00"
      }
    });
    
    // Demo certificates
    const adminCert = this.createCertificate({
      name: "Admin Cert #01",
      type: "A3",
      entityType: "PF",
      data: "CERTIFICATE_DATA",
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      createdBy: admin.id,
      allowedActions: ["Assinatura", "Autenticação", "Criptografia"]
    });
    
    const devCert = this.createCertificate({
      name: "Dev Team Cert #45",
      type: "A1",
      entityType: "PJ",
      data: "CERTIFICATE_DATA",
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      createdBy: admin.id,
      allowedActions: ["Assinatura", "Autenticação"]
    });
    
    const financeCert = this.createCertificate({
      name: "Finance Cert #12",
      type: "A3",
      entityType: "PJ",
      data: "CERTIFICATE_DATA",
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdBy: admin.id,
      allowedActions: ["Autenticação", "Criptografia"]
    });
    
    // Assign policies to certificates
    this.assignPolicyToCertificate({
      certificateId: adminCert.id,
      policyId: defaultPolicy.id
    });
    
    this.assignPolicyToCertificate({
      certificateId: devCert.id,
      policyId: defaultPolicy.id
    });
    
    this.assignPolicyToCertificate({
      certificateId: financeCert.id,
      policyId: defaultPolicy.id
    });
    
    // Assign certificates to groups
    this.assignCertificateToGroup({
      certificateId: adminCert.id,
      groupId: adminGroup.id
    });
    
    this.assignCertificateToGroup({
      certificateId: devCert.id,
      groupId: devGroup.id
    });
    
    this.assignCertificateToGroup({
      certificateId: financeCert.id,
      groupId: financeGroup.id
    });
    
    // Demo audit logs
    this.createAuditLog({
      userId: dev.id,
      action: "Assinatura Digital",
      certificateId: devCert.id,
      details: { document: "Documento de Cliente" },
      status: "Permitido"
    });
    
    this.createAuditLog({
      userId: finance.id,
      action: "Acesso Sistema Financeiro",
      certificateId: financeCert.id,
      details: { system: "Relatório Mensal" },
      status: "Permitido"
    });
    
    this.createAuditLog({
      userId: 3,
      action: "Tentativa de Acesso",
      certificateId: 3,
      details: { system: "API de Pagamentos" },
      status: "Bloqueado"
    });
    
    // Demo schedules
    this.createSchedule({
      name: "Horário Comercial",
      description: "Acesso em horário comercial padrão",
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      weekDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      },
      startTime: "08:00",
      endTime: "18:00",
      userGroupId: 1
    });
    
    this.createSchedule({
      name: "Acesso 24/7",
      description: "Acesso contínuo para operações críticas",
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      weekDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true
      },
      startTime: "00:00",
      endTime: "23:59",
      userGroupId: 2
    });
    
    this.createSchedule({
      name: "Suporte 24/7",
      description: "Acesso 24 horas para equipe de suporte",
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      weekDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true
      },
      startTime: "00:00",
      endTime: "23:59",
      userGroupId: 2
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user = { ...userData, id };
    this.usersData.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }
  
  async listUsers(): Promise<User[]> {
    return Array.from(this.usersData.values());
  }
  
  // User Group operations
  async getUserGroup(id: number): Promise<UserGroup | undefined> {
    return this.userGroupsData.get(id);
  }
  
  async getUserGroupByName(name: string): Promise<UserGroup | undefined> {
    return Array.from(this.userGroupsData.values()).find(
      (group) => group.name === name
    );
  }
  
  async createUserGroup(groupData: InsertUserGroup): Promise<UserGroup> {
    const id = this.userGroupIdCounter++;
    const group = { ...groupData, id };
    this.userGroupsData.set(id, group);
    return group;
  }
  
  async updateUserGroup(id: number, groupData: Partial<InsertUserGroup>): Promise<UserGroup | undefined> {
    const existingGroup = await this.getUserGroup(id);
    if (!existingGroup) return undefined;
    
    const updatedGroup = { ...existingGroup, ...groupData };
    this.userGroupsData.set(id, updatedGroup);
    return updatedGroup;
  }
  
  async deleteUserGroup(id: number): Promise<boolean> {
    return this.userGroupsData.delete(id);
  }
  
  async listUserGroups(): Promise<UserGroup[]> {
    return Array.from(this.userGroupsData.values());
  }
  
  // User to Group mapping
  async addUserToGroup(mapping: InsertUserToGroup): Promise<UserToGroup> {
    const id = this.userToGroupIdCounter++;
    const userToGroupMapping = { ...mapping, id };
    this.userToGroupData.set(id, userToGroupMapping);
    return userToGroupMapping;
  }
  
  async removeUserFromGroup(userId: number, groupId: number): Promise<boolean> {
    const mapping = Array.from(this.userToGroupData.values()).find(
      (m) => m.userId === userId && m.groupId === groupId
    );
    
    if (mapping) {
      return this.userToGroupData.delete(mapping.id);
    }
    
    return false;
  }
  
  async getUserGroups(userId: number): Promise<UserGroup[]> {
    const groupIds = Array.from(this.userToGroupData.values())
      .filter((mapping) => mapping.userId === userId)
      .map((mapping) => mapping.groupId);
    
    return groupIds.map((id) => this.userGroupsData.get(id)!).filter(Boolean);
  }
  
  async getUsersInGroup(groupId: number): Promise<User[]> {
    const userIds = Array.from(this.userToGroupData.values())
      .filter((mapping) => mapping.groupId === groupId)
      .map((mapping) => mapping.userId);
    
    return userIds.map((id) => this.usersData.get(id)!).filter(Boolean);
  }
  
  // Certificate operations
  async getCertificate(id: number): Promise<Certificate | undefined> {
    return this.certificatesData.get(id);
  }
  
  async createCertificate(certificateData: InsertCertificate): Promise<Certificate> {
    const id = this.certificateIdCounter++;
    const issuedAt = new Date();
    const certificate = { ...certificateData, id, issuedAt };
    this.certificatesData.set(id, certificate);
    return certificate;
  }
  
  async updateCertificate(id: number, certificateData: Partial<InsertCertificate>): Promise<Certificate | undefined> {
    const existingCertificate = await this.getCertificate(id);
    if (!existingCertificate) return undefined;
    
    const updatedCertificate = { ...existingCertificate, ...certificateData };
    this.certificatesData.set(id, updatedCertificate);
    return updatedCertificate;
  }
  
  async deleteCertificate(id: number): Promise<boolean> {
    return this.certificatesData.delete(id);
  }
  
  async listCertificates(): Promise<Certificate[]> {
    return Array.from(this.certificatesData.values());
  }
  
  // Access Policy operations
  async getAccessPolicy(id: number): Promise<AccessPolicy | undefined> {
    return this.accessPoliciesData.get(id);
  }
  
  async createAccessPolicy(policyData: InsertAccessPolicy): Promise<AccessPolicy> {
    const id = this.accessPolicyIdCounter++;
    const policy = { ...policyData, id };
    this.accessPoliciesData.set(id, policy);
    return policy;
  }
  
  async updateAccessPolicy(id: number, policyData: Partial<InsertAccessPolicy>): Promise<AccessPolicy | undefined> {
    const existingPolicy = await this.getAccessPolicy(id);
    if (!existingPolicy) return undefined;
    
    const updatedPolicy = { ...existingPolicy, ...policyData };
    this.accessPoliciesData.set(id, updatedPolicy);
    return updatedPolicy;
  }
  
  async deleteAccessPolicy(id: number): Promise<boolean> {
    return this.accessPoliciesData.delete(id);
  }
  
  async listAccessPolicies(): Promise<AccessPolicy[]> {
    return Array.from(this.accessPoliciesData.values());
  }
  
  // Certificate to Policy mapping
  async assignPolicyToCertificate(mapping: InsertCertificateToPolicy): Promise<CertificateToPolicy> {
    const id = this.certificateToPolicyIdCounter++;
    const certToPolicy = { ...mapping, id };
    this.certificateToPolicyData.set(id, certToPolicy);
    return certToPolicy;
  }
  
  async removePolicyFromCertificate(certificateId: number, policyId: number): Promise<boolean> {
    const mapping = Array.from(this.certificateToPolicyData.values()).find(
      (m) => m.certificateId === certificateId && m.policyId === policyId
    );
    
    if (mapping) {
      return this.certificateToPolicyData.delete(mapping.id);
    }
    
    return false;
  }
  
  async getCertificatePolicies(certificateId: number): Promise<AccessPolicy[]> {
    const policyIds = Array.from(this.certificateToPolicyData.values())
      .filter((mapping) => mapping.certificateId === certificateId)
      .map((mapping) => mapping.policyId);
    
    return policyIds.map((id) => this.accessPoliciesData.get(id)!).filter(Boolean);
  }
  
  // Certificate to Group mapping
  async assignCertificateToGroup(mapping: InsertCertificateToGroup): Promise<CertificateToGroup> {
    const id = this.certificateToGroupIdCounter++;
    const certToGroup = { ...mapping, id };
    this.certificateToGroupData.set(id, certToGroup);
    return certToGroup;
  }
  
  async removeCertificateFromGroup(certificateId: number, groupId: number): Promise<boolean> {
    const mapping = Array.from(this.certificateToGroupData.values()).find(
      (m) => m.certificateId === certificateId && m.groupId === groupId
    );
    
    if (mapping) {
      return this.certificateToGroupData.delete(mapping.id);
    }
    
    return false;
  }
  
  async getGroupCertificates(groupId: number): Promise<Certificate[]> {
    const certificateIds = Array.from(this.certificateToGroupData.values())
      .filter((mapping) => mapping.groupId === groupId)
      .map((mapping) => mapping.certificateId);
    
    return certificateIds.map((id) => this.certificatesData.get(id)!).filter(Boolean);
  }
  
  // Audit Log operations
  async createAuditLog(logData: InsertAuditLog): Promise<AuditLog> {
    const id = this.auditLogIdCounter++;
    const timestamp = new Date();
    const log = { ...logData, id, timestamp };
    this.auditLogsData.set(id, log);
    return log;
  }
  
  async listAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    const logs = Array.from(this.auditLogsData.values());
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return logs.slice(0, limit);
  }
  
  async getAuditLogsByUser(userId: number): Promise<AuditLog[]> {
    return Array.from(this.auditLogsData.values())
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async getAuditLogsByCertificate(certificateId: number): Promise<AuditLog[]> {
    return Array.from(this.auditLogsData.values())
      .filter((log) => log.certificateId === certificateId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  // Schedule operations
  async getSchedule(id: number): Promise<Schedule | undefined> {
    return this.schedulesData.get(id);
  }
  
  async createSchedule(scheduleData: InsertSchedule): Promise<Schedule> {
    const id = this.scheduleIdCounter++;
    const createdAt = new Date();
    const schedule = { ...scheduleData, id, createdAt };
    this.schedulesData.set(id, schedule);
    return schedule;
  }
  
  async updateSchedule(id: number, scheduleData: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const existingSchedule = await this.getSchedule(id);
    if (!existingSchedule) return undefined;
    
    const updatedSchedule = { ...existingSchedule, ...scheduleData };
    this.schedulesData.set(id, updatedSchedule);
    return updatedSchedule;
  }
  
  async deleteSchedule(id: number): Promise<boolean> {
    return this.schedulesData.delete(id);
  }
  
  async listSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedulesData.values());
  }
}

export const storage = new MemStorage();
