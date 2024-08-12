import { cache } from "react";
 
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

type User = {
  email?: string;
  id?: string;
};

export const getUser = async ({ email, id }: User) => {
  if (!email && !id) return undefined;
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(
        email ? eq(users.email, email) : id ? eq(users.id, id) : undefined
      );
    return user;
  } catch (error) {
    throw new Error("Error getting user from database");
  }
};

export const getUsers = cache(async () => {
  try {
    return await db.select().from(users);
  } catch (error) {
    throw new Error("Error getting users from database");
  }
});
