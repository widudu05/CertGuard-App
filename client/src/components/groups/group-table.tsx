import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface GroupTableProps {
  groups: any[];
  onEdit: (group: any) => void;
  onDelete: (group: any) => void;
}

const GroupTable: React.FC<GroupTableProps> = ({ groups, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Grupo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Membros</TableHead>
            <TableHead>Certificados</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id} className="hover:bg-zinc-50">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <span className="material-icons text-blue-600 mr-2">groups</span>
                  {group.name}
                </div>
              </TableCell>
              <TableCell>{group.description || "—"}</TableCell>
              <TableCell>
                {/* This would be populated with actual count in a real implementation */}
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  {Math.floor(Math.random() * 10) + 1} membros
                </span>
              </TableCell>
              <TableCell>
                {/* This would be populated with actual count in a real implementation */}
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                  {Math.floor(Math.random() * 5)} certificados
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(group)}
                  >
                    <span className="material-icons text-zinc-600">edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(group)}
                  >
                    <span className="material-icons text-zinc-600">delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {groups.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhum grupo encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GroupTable;
