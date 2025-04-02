import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertGroupSchema, insertCertificateSchema, 
  insertPermissionSchema, insertUrlRestrictionSchema, insertTimeRestrictionSchema,
  insertCertificateActionSchema, insertAuditLogSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Error handling middleware for Zod validation errors
  const handleZodError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  // Log API request for audit
  const logAuditAction = async (userId: number | undefined, action: string, resourceType: string, resourceId?: number, details?: any, ipAddress?: string) => {
    try {
      await storage.createAuditLog({
        userId,
        action,
        resourceType,
        resourceId,
        details,
        ipAddress
      });
    } catch (error) {
      console.error("Failed to create audit log:", error);
    }
  };

  // Dashboard stats
  app.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const certificatesCount = await storage.getCertificatesCount();
      const groupsCount = await storage.getAllGroups().then(groups => groups.length);
      const expiredCertificatesCount = await storage.getExpiredCertificatesCount();
      const urlRestrictionsCount = await storage.getActiveUrlRestrictionsCount();

      return res.json({
        certificatesCount,
        groupsCount,
        expiredCertificatesCount,
        urlRestrictionsCount
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  // User routes
  app.get("/api/users", async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      await logAuditAction(undefined, "CREATE", "USER", newUser.id, { username: newUser.username }, req.ip);
      
      return res.status(201).json(newUser);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userData = insertUserSchema.partial().parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // If username is being updated, check if it's unique
      if (userData.username && userData.username !== existingUser.username) {
        const userWithSameUsername = await storage.getUserByUsername(userData.username);
        if (userWithSameUsername) {
          return res.status(409).json({ error: "Username already exists" });
        }
      }
      
      const updatedUser = await storage.updateUser(userId, userData);
      await logAuditAction(undefined, "UPDATE", "USER", userId, { updates: Object.keys(userData) }, req.ip);
      
      return res.json(updatedUser);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      await storage.deleteUser(userId);
      await logAuditAction(undefined, "DELETE", "USER", userId, { username: user.username }, req.ip);
      
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Group routes
  app.get("/api/groups", async (_req, res) => {
    try {
      const groups = await storage.getAllGroups();
      return res.json(groups);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get groups" });
    }
  });

  app.get("/api/groups/:id", async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const group = await storage.getGroup(groupId);
      
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      
      return res.json(group);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get group" });
    }
  });

  app.post("/api/groups", async (req, res) => {
    try {
      const groupData = insertGroupSchema.parse(req.body);
      const newGroup = await storage.createGroup(groupData);
      await logAuditAction(undefined, "CREATE", "GROUP", newGroup.id, { name: newGroup.name }, req.ip);
      
      return res.status(201).json(newGroup);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/groups/:id", async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const groupData = insertGroupSchema.partial().parse(req.body);
      
      const existingGroup = await storage.getGroup(groupId);
      if (!existingGroup) {
        return res.status(404).json({ error: "Group not found" });
      }
      
      const updatedGroup = await storage.updateGroup(groupId, groupData);
      await logAuditAction(undefined, "UPDATE", "GROUP", groupId, { updates: Object.keys(groupData) }, req.ip);
      
      return res.json(updatedGroup);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/groups/:id", async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const group = await storage.getGroup(groupId);
      
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      
      await storage.deleteGroup(groupId);
      await logAuditAction(undefined, "DELETE", "GROUP", groupId, { name: group.name }, req.ip);
      
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete group" });
    }
  });

  // Certificate routes
  app.get("/api/certificates", async (_req, res) => {
    try {
      const certificates = await storage.getAllCertificates();
      return res.json(certificates);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get certificates" });
    }
  });

  app.get("/api/certificates/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string || "3");
      const certificates = await storage.getRecentCertificates(limit);
      return res.json(certificates);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get recent certificates" });
    }
  });

  app.get("/api/certificates/:id", async (req, res) => {
    try {
      const certificateId = parseInt(req.params.id);
      const certificate = await storage.getCertificate(certificateId);
      
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      
      return res.json(certificate);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get certificate" });
    }
  });

  app.post("/api/certificates", async (req, res) => {
    try {
      const certificateData = insertCertificateSchema.parse(req.body);
      const newCertificate = await storage.createCertificate(certificateData);
      await logAuditAction(undefined, "CREATE", "CERTIFICATE", newCertificate.id, { name: newCertificate.name }, req.ip);
      
      return res.status(201).json(newCertificate);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/certificates/:id", async (req, res) => {
    try {
      const certificateId = parseInt(req.params.id);
      const certificateData = insertCertificateSchema.partial().parse(req.body);
      
      const existingCertificate = await storage.getCertificate(certificateId);
      if (!existingCertificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      
      const updatedCertificate = await storage.updateCertificate(certificateId, certificateData);
      await logAuditAction(undefined, "UPDATE", "CERTIFICATE", certificateId, { updates: Object.keys(certificateData) }, req.ip);
      
      return res.json(updatedCertificate);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/certificates/:id", async (req, res) => {
    try {
      const certificateId = parseInt(req.params.id);
      const certificate = await storage.getCertificate(certificateId);
      
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      
      await storage.deleteCertificate(certificateId);
      await logAuditAction(undefined, "DELETE", "CERTIFICATE", certificateId, { name: certificate.name }, req.ip);
      
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete certificate" });
    }
  });

  // Permission routes
  app.get("/api/permissions/certificate/:certificateId", async (req, res) => {
    try {
      const certificateId = parseInt(req.params.certificateId);
      const permissions = await storage.getPermissionsByCertificate(certificateId);
      return res.json(permissions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get permissions" });
    }
  });

  app.get("/api/permissions/group/:groupId", async (req, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const permissions = await storage.getPermissionsByGroup(groupId);
      return res.json(permissions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get permissions" });
    }
  });

  app.post("/api/permissions", async (req, res) => {
    try {
      const permissionData = insertPermissionSchema.parse(req.body);
      
      // Verify certificate and group exist
      const certificate = await storage.getCertificate(permissionData.certificateId);
      const group = await storage.getGroup(permissionData.groupId);
      
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      
      const newPermission = await storage.createPermission(permissionData);
      await logAuditAction(
        undefined, 
        "CREATE", 
        "PERMISSION", 
        newPermission.id, 
        { 
          certificateId: newPermission.certificateId,
          groupId: newPermission.groupId
        }, 
        req.ip
      );
      
      return res.status(201).json(newPermission);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/permissions/:id", async (req, res) => {
    try {
      const permissionId = parseInt(req.params.id);
      const permissionData = insertPermissionSchema.partial().parse(req.body);
      
      const existingPermission = await storage.getPermission(permissionId);
      if (!existingPermission) {
        return res.status(404).json({ error: "Permission not found" });
      }
      
      const updatedPermission = await storage.updatePermission(permissionId, permissionData);
      await logAuditAction(
        undefined, 
        "UPDATE", 
        "PERMISSION", 
        permissionId, 
        { updates: Object.keys(permissionData) }, 
        req.ip
      );
      
      return res.json(updatedPermission);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/permissions/:id", async (req, res) => {
    try {
      const permissionId = parseInt(req.params.id);
      const permission = await storage.getPermission(permissionId);
      
      if (!permission) {
        return res.status(404).json({ error: "Permission not found" });
      }
      
      await storage.deletePermission(permissionId);
      await logAuditAction(
        undefined, 
        "DELETE", 
        "PERMISSION", 
        permissionId, 
        { 
          certificateId: permission.certificateId,
          groupId: permission.groupId
        }, 
        req.ip
      );
      
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete permission" });
    }
  });

  // URL Restriction routes
  app.get("/api/url-restrictions/certificate/:certificateId", async (req, res) => {
    try {
      const certificateId = parseInt(req.params.certificateId);
      const restrictions = await storage.getUrlRestrictionsByCertificate(certificateId);
      return res.json(restrictions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get URL restrictions" });
    }
  });

  app.post("/api/url-restrictions", async (req, res) => {
    try {
      const restrictionData = insertUrlRestrictionSchema.parse(req.body);
      
      // Verify certificate exists
      const certificate = await storage.getCertificate(restrictionData.certificateId);
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      
      const newRestriction = await storage.createUrlRestriction(restrictionData);
      await logAuditAction(
        undefined, 
        "CREATE", 
        "URL_RESTRICTION", 
        newRestriction.id, 
        { 
          certificateId: newRestriction.certificateId,
          pattern: newRestriction.pattern
        }, 
        req.ip
      );
      
      return res.status(201).json(newRestriction);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/url-restrictions/:id", async (req, res) => {
    try {
      const restrictionId = parseInt(req.params.id);
      const restrictionData = insertUrlRestrictionSchema.partial().parse(req.body);
      
      const existingRestriction = await storage.getUrlRestriction(restrictionId);
      if (!existingRestriction) {
        return res.status(404).json({ error: "URL restriction not found" });
      }
      
      const updatedRestriction = await storage.updateUrlRestriction(restrictionId, restrictionData);
      await logAuditAction(
        undefined, 
        "UPDATE", 
        "URL_RESTRICTION", 
        restrictionId, 
        { updates: Object.keys(restrictionData) }, 
        req.ip
      );
      
      return res.json(updatedRestriction);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/url-restrictions/:id", async (req, res) => {
    try {
      const restrictionId = parseInt(req.params.id);
      const restriction = await storage.getUrlRestriction(restrictionId);
      
      if (!restriction) {
        return res.status(404).json({ error: "URL restriction not found" });
      }
      
      await storage.deleteUrlRestriction(restrictionId);
      await logAuditAction(
        undefined, 
        "DELETE", 
        "URL_RESTRICTION", 
        restrictionId, 
        { 
          certificateId: restriction.certificateId,
          pattern: restriction.pattern
        }, 
        req.ip
      );
      
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete URL restriction" });
    }
  });

  // Time Restriction routes
  app.get("/api/time-restrictions/certificate/:certificateId", async (req, res) => {
    try {
      const certificateId = parseInt(req.params.certificateId);
      const restrictions = await storage.getTimeRestrictionsByCertificate(certificateId);
      return res.json(restrictions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get time restrictions" });
    }
  });

  app.post("/api/time-restrictions", async (req, res) => {
    try {
      const restrictionData = insertTimeRestrictionSchema.parse(req.body);
      
      // Verify certificate exists
      const certificate = await storage.getCertificate(restrictionData.certificateId);
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      
      const newRestriction = await storage.createTimeRestriction(restrictionData);
      await logAuditAction(
        undefined, 
        "CREATE", 
        "TIME_RESTRICTION", 
        newRestriction.id, 
        { 
          certificateId: newRestriction.certificateId,
          daysOfWeek: newRestriction.daysOfWeek,
          startTime: newRestriction.startTime,
          endTime: newRestriction.endTime
        }, 
        req.ip
      );
      
      return res.status(201).json(newRestriction);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/time-restrictions/:id", async (req, res) => {
    try {
      const restrictionId = parseInt(req.params.id);
      const restrictionData = insertTimeRestrictionSchema.partial().parse(req.body);
      
      const existingRestriction = await storage.getTimeRestriction(restrictionId);
      if (!existingRestriction) {
        return res.status(404).json({ error: "Time restriction not found" });
      }
      
      const updatedRestriction = await storage.updateTimeRestriction(restrictionId, restrictionData);
      await logAuditAction(
        undefined, 
        "UPDATE", 
        "TIME_RESTRICTION", 
        restrictionId, 
        { updates: Object.keys(restrictionData) }, 
        req.ip
      );
      
      return res.json(updatedRestriction);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/time-restrictions/:id", async (req, res) => {
    try {
      const restrictionId = parseInt(req.params.id);
      const restriction = await storage.getTimeRestriction(restrictionId);
      
      if (!restriction) {
        return res.status(404).json({ error: "Time restriction not found" });
      }
      
      await storage.deleteTimeRestriction(restrictionId);
      await logAuditAction(
        undefined, 
        "DELETE", 
        "TIME_RESTRICTION", 
        restrictionId, 
        { 
          certificateId: restriction.certificateId,
          daysOfWeek: restriction.daysOfWeek,
          startTime: restriction.startTime,
          endTime: restriction.endTime
        }, 
        req.ip
      );
      
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete time restriction" });
    }
  });

  // Certificate Action routes
  app.get("/api/certificate-actions/certificate/:certificateId", async (req, res) => {
    try {
      const certificateId = parseInt(req.params.certificateId);
      const actions = await storage.getCertificateActionsByCertificate(certificateId);
      return res.json(actions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get certificate actions" });
    }
  });

  app.post("/api/certificate-actions", async (req, res) => {
    try {
      const actionData = insertCertificateActionSchema.parse(req.body);
      
      // Verify certificate exists
      const certificate = await storage.getCertificate(actionData.certificateId);
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      
      const newAction = await storage.createCertificateAction(actionData);
      await logAuditAction(
        undefined, 
        "CREATE", 
        "CERTIFICATE_ACTION", 
        newAction.id, 
        { 
          certificateId: newAction.certificateId,
          action: newAction.action
        }, 
        req.ip
      );
      
      return res.status(201).json(newAction);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/certificate-actions/:id", async (req, res) => {
    try {
      const actionId = parseInt(req.params.id);
      const actionData = insertCertificateActionSchema.partial().parse(req.body);
      
      const existingAction = await storage.getCertificateAction(actionId);
      if (!existingAction) {
        return res.status(404).json({ error: "Certificate action not found" });
      }
      
      const updatedAction = await storage.updateCertificateAction(actionId, actionData);
      await logAuditAction(
        undefined, 
        "UPDATE", 
        "CERTIFICATE_ACTION", 
        actionId, 
        { updates: Object.keys(actionData) }, 
        req.ip
      );
      
      return res.json(updatedAction);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/certificate-actions/:id", async (req, res) => {
    try {
      const actionId = parseInt(req.params.id);
      const action = await storage.getCertificateAction(actionId);
      
      if (!action) {
        return res.status(404).json({ error: "Certificate action not found" });
      }
      
      await storage.deleteCertificateAction(actionId);
      await logAuditAction(
        undefined, 
        "DELETE", 
        "CERTIFICATE_ACTION", 
        actionId, 
        { 
          certificateId: action.certificateId,
          action: action.action
        }, 
        req.ip
      );
      
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete certificate action" });
    }
  });

  // Audit Log routes
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const logs = await storage.getAllAuditLogs();
      return res.json(logs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get audit logs" });
    }
  });

  app.get("/api/audit-logs/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string || "10");
      const logs = await storage.getRecentAuditLogs(limit);
      return res.json(logs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get recent audit logs" });
    }
  });

  app.get("/api/audit-logs/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const logs = await storage.getAuditLogsByUser(userId);
      return res.json(logs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get user audit logs" });
    }
  });

  return httpServer;
}
