import { adminGetUsers } from "@/app/actions";
import UsersClient from "./UsersClient";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const users = await adminGetUsers();

  return <UsersClient initialUsers={users} />;
}
