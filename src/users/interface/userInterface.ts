export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  refreshHash: string | null;
}