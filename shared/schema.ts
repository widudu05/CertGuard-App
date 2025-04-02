import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  avatarUrl: text("avatar_url"),
  groupId: integer("group_id"),
});

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  fingerprint: text("fingerprint").notNull(),
  issuedTo: text("issued_to").notNull(),
  issuedToEmail: text("issued_to_email").notNull(),
  expireAt: timestamp("expire_at").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  data: text("data").notNull(),
});

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  certificateId: integer("certificate_id").notNull(),
  groupId: integer("group_id").notNull(),
  canView: boolean("can_view").notNull().default(false),
  canEdit: boolean("can_edit").notNull().default(false),
  canDelete: boolean("can_delete").notNull().default(false),
  canDownload: boolean("can_download").notNull().default(false),
});

export const urlRestrictions = pgTable("url_restrictions", {
  id: serial("id").primaryKey(),
  certificateId: integer("certificate_id").notNull(),
  pattern: text("pattern").notNull(),
  isAllowed: boolean("is_allowed").notNull().default(true),
});

export const timeRestrictions = pgTable("time_restrictions", {
  id: serial("id").primaryKey(),
  certificateId: integer("certificate_id").notNull(),
  daysOfWeek: jsonb("days_of_week").notNull(), // Array of days (0-6)
  startTime: text("start_time").notNull(), // 24-hour format "HH:MM"
  endTime: text("end_time").notNull(), // 24-hour format "HH:MM"
  timezone: text("timezone").notNull().default("UTC"),
});

export const certificateActions = pgTable("certificate_actions", {
  id: serial("id").primaryKey(),
  certificateId: integer("certificate_id").notNull(),
  action: text("action").notNull(), // "sign", "auth", "encrypt", etc.
  isAllowed: boolean("is_allowed").notNull().default(true),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: integer("resource_id"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertGroupSchema = createInsertSchema(groups).omit({ id: true });
export const insertCertificateSchema = createInsertSchema(certificates).omit({ id: true, createdAt: true });
export const insertPermissionSchema = createInsertSchema(permissions).omit({ id: true });
export const insertUrlRestrictionSchema = createInsertSchema(urlRestrictions).omit({ id: true });
export const insertTimeRestrictionSchema = createInsertSchema(timeRestrictions).omit({ id: true });
export const insertCertificateActionSchema = createInsertSchema(certificateActions).omit({ id: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type UrlRestriction = typeof urlRestrictions.$inferSelect;
export type TimeRestriction = typeof timeRestrictions.$inferSelect;
export type CertificateAction = typeof certificateActions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type InsertUrlRestriction = z.infer<typeof insertUrlRestrictionSchema>;
export type InsertTimeRestriction = z.infer<typeof insertTimeRestrictionSchema>;
export type InsertCertificateAction = z.infer<typeof insertCertificateActionSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
