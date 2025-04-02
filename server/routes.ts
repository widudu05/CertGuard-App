import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertUserGroupSchema,
  insertUserToGroupSchema,
  insertCertificateSchema,
  insertAccessPolicySchema,
  insertCertificateToPolicySchema,
  insertCertificateToGroupSchema,
  insertAuditLogSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.listUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userInput = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userInput);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.put("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userInput = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userInput);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating user" });
    }
  });

  // User Group routes
  app.get("/api/user-groups", async (req: Request, res: Response) => {
    try {
      const groups = await storage.listUserGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user groups" });
    }
  });

  app.get("/api/user-groups/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const group = await storage.getUserGroup(id);
      
      if (!group) {
        return res.status(404).json({ message: "User group not found" });
      }
      
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user group" });
    }
  });

  app.post("/api/user-groups", async (req: Request, res: Response) => {
    try {
      const groupInput = insertUserGroupSchema.parse(req.body);
      const group = await storage.createUserGroup(groupInput);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid group data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user group" });
    }
  });

  app.put("/api/user-groups/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const groupInput = insertUserGroupSchema.partial().parse(req.body);
      const group = await storage.updateUserGroup(id, groupInput);
      
      if (!group) {
        return res.status(404).json({ message: "User group not found" });
      }
      
      res.json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid group data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating user group" });
    }
  });

  app.delete("/api/user-groups/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteUserGroup(id);
      
      if (!success) {
        return res.status(404).json({ message: "User group not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user group" });
    }
  });

  // User Group membership routes
  app.post("/api/user-groups/members", async (req: Request, res: Response) => {
    try {
      const memberInput = insertUserToGroupSchema.parse(req.body);
      const mapping = await storage.addUserToGroup(memberInput);
      res.status(201).json(mapping);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid membership data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding user to group" });
    }
  });

  app.delete("/api/user-groups/:groupId/members/:userId", async (req: Request, res: Response) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const userId = parseInt(req.params.userId);
      const success = await storage.removeUserFromGroup(userId, groupId);
      
      if (!success) {
        return res.status(404).json({ message: "Membership not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing user from group" });
    }
  });

  app.get("/api/users/:userId/groups", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const groups = await storage.getUserGroups(userId);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user's groups" });
    }
  });

  app.get("/api/user-groups/:groupId/members", async (req: Request, res: Response) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const users = await storage.getUsersInGroup(groupId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching group members" });
    }
  });

  // Certificate routes
  app.get("/api/certificates", async (req: Request, res: Response) => {
    try {
      const certificates = await storage.listCertificates();
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching certificates" });
    }
  });

  app.get("/api/certificates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const certificate = await storage.getCertificate(id);
      
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ message: "Error fetching certificate" });
    }
  });

  app.post("/api/certificates", async (req: Request, res: Response) => {
    try {
      const certificateInput = insertCertificateSchema.parse(req.body);
      const certificate = await storage.createCertificate(certificateInput);
      res.status(201).json(certificate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid certificate data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating certificate" });
    }
  });

  app.put("/api/certificates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const certificateInput = insertCertificateSchema.partial().parse(req.body);
      const certificate = await storage.updateCertificate(id, certificateInput);
      
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      
      res.json(certificate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid certificate data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating certificate" });
    }
  });

  app.delete("/api/certificates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCertificate(id);
      
      if (!success) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting certificate" });
    }
  });

  // Access Policy routes
  app.get("/api/access-policies", async (req: Request, res: Response) => {
    try {
      const policies = await storage.listAccessPolicies();
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching access policies" });
    }
  });

  app.get("/api/access-policies/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const policy = await storage.getAccessPolicy(id);
      
      if (!policy) {
        return res.status(404).json({ message: "Access policy not found" });
      }
      
      res.json(policy);
    } catch (error) {
      res.status(500).json({ message: "Error fetching access policy" });
    }
  });

  app.post("/api/access-policies", async (req: Request, res: Response) => {
    try {
      const policyInput = insertAccessPolicySchema.parse(req.body);
      const policy = await storage.createAccessPolicy(policyInput);
      res.status(201).json(policy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid policy data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating access policy" });
    }
  });

  app.put("/api/access-policies/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const policyInput = insertAccessPolicySchema.partial().parse(req.body);
      const policy = await storage.updateAccessPolicy(id, policyInput);
      
      if (!policy) {
        return res.status(404).json({ message: "Access policy not found" });
      }
      
      res.json(policy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid policy data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating access policy" });
    }
  });

  app.delete("/api/access-policies/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAccessPolicy(id);
      
      if (!success) {
        return res.status(404).json({ message: "Access policy not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting access policy" });
    }
  });

  // Certificate Policy association routes
  app.post("/api/certificates/policies", async (req: Request, res: Response) => {
    try {
      const mappingInput = insertCertificateToPolicySchema.parse(req.body);
      const mapping = await storage.assignPolicyToCertificate(mappingInput);
      res.status(201).json(mapping);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid mapping data", errors: error.errors });
      }
      res.status(500).json({ message: "Error assigning policy to certificate" });
    }
  });

  app.delete("/api/certificates/:certId/policies/:policyId", async (req: Request, res: Response) => {
    try {
      const certId = parseInt(req.params.certId);
      const policyId = parseInt(req.params.policyId);
      const success = await storage.removePolicyFromCertificate(certId, policyId);
      
      if (!success) {
        return res.status(404).json({ message: "Policy association not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing policy from certificate" });
    }
  });

  app.get("/api/certificates/:certId/policies", async (req: Request, res: Response) => {
    try {
      const certId = parseInt(req.params.certId);
      const policies = await storage.getCertificatePolicies(certId);
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching certificate policies" });
    }
  });

  // Certificate Group association routes
  app.post("/api/certificates/groups", async (req: Request, res: Response) => {
    try {
      const mappingInput = insertCertificateToGroupSchema.parse(req.body);
      const mapping = await storage.assignCertificateToGroup(mappingInput);
      res.status(201).json(mapping);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid mapping data", errors: error.errors });
      }
      res.status(500).json({ message: "Error assigning certificate to group" });
    }
  });

  app.delete("/api/certificates/:certId/groups/:groupId", async (req: Request, res: Response) => {
    try {
      const certId = parseInt(req.params.certId);
      const groupId = parseInt(req.params.groupId);
      const success = await storage.removeCertificateFromGroup(certId, groupId);
      
      if (!success) {
        return res.status(404).json({ message: "Group association not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing certificate from group" });
    }
  });

  app.get("/api/user-groups/:groupId/certificates", async (req: Request, res: Response) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const certificates = await storage.getGroupCertificates(groupId);
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching group certificates" });
    }
  });

  // Audit Log routes
  app.get("/api/audit-logs", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const logs = await storage.listAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching audit logs" });
    }
  });

  app.post("/api/audit-logs", async (req: Request, res: Response) => {
    try {
      const logInput = insertAuditLogSchema.parse(req.body);
      const log = await storage.createAuditLog(logInput);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid log data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating audit log" });
    }
  });

  app.get("/api/users/:userId/audit-logs", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const logs = await storage.getAuditLogsByUser(userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user audit logs" });
    }
  });

  app.get("/api/certificates/:certId/audit-logs", async (req: Request, res: Response) => {
    try {
      const certId = parseInt(req.params.certId);
      const logs = await storage.getAuditLogsByCertificate(certId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching certificate audit logs" });
    }
  });

  // Stats endpoint for dashboard
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const users = await storage.listUsers();
      const certificates = await storage.listCertificates();
      const groups = await storage.listUserGroups();
      const policies = await storage.listAccessPolicies();
      const logs = await storage.listAuditLogs(100);
      
      const activeUsers = users.filter(u => u.isActive).length;
      const activeCertificates = certificates.length;
      const activeGroups = groups.length;
      const restrictionsCount = policies.length;
      const blockedAccess = logs.filter(log => log.status === "Bloqueado").length;
      
      const stats = {
        activeUsers,
        activeCertificates,
        activeGroups,
        restrictionsCount,
        blockedAccess,
        recentLogs: logs.slice(0, 10)
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
