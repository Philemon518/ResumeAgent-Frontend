import type { RoleSummary } from "./types";

export const DEPARTMENT_ORDER = [
  "Art",
  "Data & ML",
  "Design",
  "Economics",
  "Engineering",
  "General",
  "Product",
] as const;

export type Department = (typeof DEPARTMENT_ORDER)[number];

export interface RoleGroup {
  department: string;
  roles: RoleSummary[];
}

export function groupRolesByDepartment(roles: RoleSummary[]): RoleGroup[] {
  const buckets = new Map<string, RoleSummary[]>();
  for (const role of roles) {
    const department = role.department || "General";
    const list = buckets.get(department);
    if (list) list.push(role);
    else buckets.set(department, [role]);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "en", { sensitivity: "base" }))
    .map(([department, grouped]) => ({
      department,
      roles: [...grouped].sort((a, b) =>
        a.position_title.localeCompare(b.position_title, "en", {
          sensitivity: "base",
        }),
      ),
    }));
}
