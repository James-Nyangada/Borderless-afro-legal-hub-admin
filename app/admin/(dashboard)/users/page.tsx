import { UserPlus, MoreVertical, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export default function UsersPage() {
  const users = [
    { id: 1, name: 'Ian (You)', email: 'admin@borderlessafro.com', role: 'Admin', status: 'Active', lastActive: 'Just now', initials: 'IA' },
    { id: 2, name: 'Frankie Sullivan', email: 'frankie@borderlessafro.com', role: 'Editor', status: 'Active', lastActive: '2 days ago', initials: 'FS' },
    { id: 3, name: 'Guest Writer', email: 'writer@external.com', role: 'Author', status: 'Active', lastActive: '1 week ago', initials: 'GW' },
    { id: 4, name: 'Board Member', email: 'stakeholder@investor.com', role: 'Viewer', status: 'Inactive', lastActive: '2 months ago', initials: 'BM' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Team Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage who has access to this dashboard and their permission levels.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-3">
          <Button className="bg-navy hover:bg-navy/90 text-white shadow-sm">
            <UserPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Invite User
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <ul role="list" className="divide-y divide-gray-100">
          {users.map((user) => (
            <li key={user.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy text-lg shrink-0">
                  {user.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
                    {user.id === 1 && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium">
                        It's you
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                <div className="flex flex-col gap-1 items-start sm:items-end w-32">
                  <div className="flex items-center gap-1 text-sm text-gray-900 font-medium">
                    <Shield className="h-4 w-4 text-gray-400" />
                    {user.role}
                  </div>
                  <span className={`text-xs ${user.status === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>
                    {user.status} • {user.lastActive}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                  {user.id !== 1 ? (
                    <>
                      <Select defaultValue={user.role}>
                        <SelectTrigger className="w-[110px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Author">Author</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                          <SelectItem value="remove" className="text-red-600">Remove Access</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 italic px-4">Cannot edit self</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-8 shadow-sm border-gray-100">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-lg font-medium text-navy">Roles Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-50/50 shadow-none border-gray-100">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Admin</h4>
                <p className="text-xs text-gray-500">Full access to all settings, users, and content.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50/50 shadow-none border-gray-100">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Editor</h4>
                <p className="text-xs text-gray-500">Can publish and edit any post, manage categories.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50/50 shadow-none border-gray-100">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Author</h4>
                <p className="text-xs text-gray-500">Can only create and edit their own posts.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50/50 shadow-none border-gray-100">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Viewer</h4>
                <p className="text-xs text-gray-500">Read-only access to dashboard and analytics.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
