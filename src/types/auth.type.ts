import { UserRoleEnum } from "../lib/enum/user-role.enum";

export { UserRoleEnum };

/** @deprecated Use UserRoleEnum instead */
export type RoleCode = UserRoleEnum;

// Maps: app.language_code enum

// Normalised auth user mirroring AuthUserData from API
export type User = {
  userId: number | string;
  actorType: string;
  role: UserRoleEnum;
  accessToken: string;
  refreshToken: string;
  username: string;
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  /** From get-me (AdminMeDataRES). When true, bypass all menu/page permission filtering. */
  globalAccess?: boolean;
};
