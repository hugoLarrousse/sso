interface User {
  id: number;
  uuid: string;
  clientId: number;
  email: string;
  password: string;
  verifiedAt: Date;
  archivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
