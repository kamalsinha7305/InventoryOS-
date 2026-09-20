export interface Warehouse {
  id: number;
  name: string;
  location?: string;
  capacity?: number;
  availableCapacity?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
