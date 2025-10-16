import type { QueryCtx } from "../_generated/server";
import type { DataModel } from "../_generated/dataModel";

const TABLES = ["tasks", "threads", "messages", "userPreferences"] as const;
const PRIMARY_TABLE = "tasks";

export async function loadSummary(ctx: QueryCtx, userId?: string) {
  const perTable: Record<string, number> = {};

  for (const table of TABLES) {
    // Use type assertion to tell TypeScript this is a valid table name
    const records = await ctx.db.query(table as keyof DataModel).collect();
    const scopedRecords = userId ? records.filter((record: any) => record.userId === userId) : records;
    perTable[table] = scopedRecords.length;
  }

  const totals = Object.values(perTable);
  const totalRecords = totals.reduce((sum, count) => sum + count, 0);

  return {
    totalRecords,
    perTable,
    activeUsers: 0, // No users table in this schema
    primaryTableCount: perTable[PRIMARY_TABLE] ?? 0,
  };
}

export async function loadRecent(ctx: QueryCtx, userId?: string, limit = 5) {
  // Use type assertion for dynamic table access
  const records = await ctx.db.query(PRIMARY_TABLE as keyof DataModel).collect();
  const scopedRecords = userId ? records.filter((record: any) => record.userId === userId) : records;

  scopedRecords.sort((a: any, b: any) => {
    const aTime = a.updatedAt ?? 0;
    const bTime = b.updatedAt ?? 0;
    return bTime - aTime;
  });

  return scopedRecords.slice(0, limit).map((record: any) => ({
    _id: record._id,
    name: record.title ?? "Untitled",
    status: record.status,
    updatedAt: record.updatedAt ?? null,
  }));
}
