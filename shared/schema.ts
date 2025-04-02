import { pgTable, text, serial, integer, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").notNull().default(true),
});

// User groups table
export const userGroups = pgTable("user_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// User to group mapping
export const userToGroup = pgTable("user_to_group", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  groupId: integer("group_id").notNull().references(() => userGroups.id),
});

// Certificates table
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  data: text("data").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  allowedActions: json("allowed_actions").notNull(),
});

// Access policies table
export const accessPolicies = pgTable("access_policies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  allowedSystems: json("allowed_systems"),
  blockedUrls: json("blocked_urls"),
  allowedUrls: json("allowed_urls"),
  sensitiveInfoRules: json("sensitive_info_rules"),
  accessHours: json("access_hours"),
});

// Certificate to policy mapping
export const certificateToPolicy = pgTable("certificate_to_policy", {
  id: serial("id").primaryKey(),
  certificateId: integer("certificate_id").notNull().references(() => certificates.id),
  policyId: integer("policy_id").notNull().references(() => accessPolicies.id),
});

// Certificate to group mapping
export const certificateToGroup = pgTable("certificate_to_group", {
  id: serial("id").primaryKey(),
  certificateId: integer("certificate_id").notNull().references(() => certificates.id),
  groupId: integer("group_id").notNull().references(() => userGroups.id),
});

// Audit logs
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  certificateId: integer("certificate_id").references(() => certificates.id),
  details: json("details"),
  status: text("status").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertUserGroupSchema = createInsertSchema(userGroups).omit({ id: true });
export const insertUserToGroupSchema = createInsertSchema(userToGroup).omit({ id: true });
export const insertCertificateSchema = createInsertSchema(certificates).omit({ id: true, issuedAt: true });
export const insertAccessPolicySchema = createInsertSchema(accessPolicies).omit({ id: true });
export const insertCertificateToPolicySchema = createInsertSchema(certificateToPolicy).omit({ id: true });
export const insertCertificateToGroupSchema = createInsertSchema(certificateToGroup).omit({ id: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserGroup = typeof userGroups.$inferSelect;
export type InsertUserGroup = z.infer<typeof insertUserGroupSchema>;

export type UserToGroup = typeof userToGroup.$inferSelect;
export type InsertUserToGroup = z.infer<typeof insertUserToGroupSchema>;

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

export type AccessPolicy = typeof accessPolicies.$inferSelect;
export type InsertAccessPolicy = z.infer<typeof insertAccessPolicySchema>;

export type CertificateToPolicy = typeof certificateToPolicy.$inferSelect;
export type InsertCertificateToPolicy = z.infer<typeof insertCertificateToPolicySchema>;

export type CertificateToGroup = typeof certificateToGroup.$inferSelect;
export type InsertCertificateToGroup = z.infer<typeof insertCertificateToGroupSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
