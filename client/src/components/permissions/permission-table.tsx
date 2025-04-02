import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PermissionTableProps {
  permissions: any[];
  certificates?: any[];
  groups?: any[];
  onUpdatePermission: (permission: any, field: string, value: boolean) => void;
  emptyMessage: string;
}

const PermissionTable: React.FC<PermissionTableProps> = ({
  permissions,
  certificates,
  groups,
  onUpdatePermission,
  emptyMessage
}) => {
  const getGroupName = (groupId: number) => {
    if (!groups) return "—";
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : "—";
  };
  
  const getCertificateName = (certificateId: number) => {
    if (!certificates) return "—";
    const certificate = certificates.find(c => c.id === certificateId);
    return certificate ? certificate.name : "—";
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      {permissions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              {certificates && <TableHead>Certificado</TableHead>}
              {groups && <TableHead>Grupo</TableHead>}
              <TableHead>Visualizar</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Excluir</TableHead>
              <TableHead>Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id} className="hover:bg-zinc-50">
                {certificates && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-blue-600">description</span>
                      <span>{getCertificateName(permission.certificateId)}</span>
                    </div>
                  </TableCell>
                )}
                
                {groups && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-blue-600">groups</span>
                      <span>{getGroupName(permission.groupId)}</span>
                    </div>
                  </TableCell>
                )}
                
                <TableCell>
                  <Switch 
                    checked={permission.canView} 
                    onCheckedChange={(checked) => onUpdatePermission(permission, 'canView', checked)}
                  />
                </TableCell>
                
                <TableCell>
                  <Switch 
                    checked={permission.canEdit} 
                    onCheckedChange={(checked) => onUpdatePermission(permission, 'canEdit', checked)}
                  />
                </TableCell>
                
                <TableCell>
                  <Switch 
                    checked={permission.canDelete} 
                    onCheckedChange={(checked) => onUpdatePermission(permission, 'canDelete', checked)}
                  />
                </TableCell>
                
                <TableCell>
                  <Switch 
                    checked={permission.canDownload} 
                    onCheckedChange={(checked) => onUpdatePermission(permission, 'canDownload', checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center h-32 text-zinc-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default PermissionTable;
