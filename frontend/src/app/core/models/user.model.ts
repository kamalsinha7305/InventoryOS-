export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  token?: string; // JWT token if returned from login
  createdAt?: string;
  updatedAt?: string;
}
