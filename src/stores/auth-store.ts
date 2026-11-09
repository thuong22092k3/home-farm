"use client";

import { AUTH_TOKEN_KEYS } from "@/lib/constants/auth.constant";
import { UserRoleEnum } from "@/lib/enum/user-role.enum";
import { deleteCookie, setCookie } from "@/lib/helpers/cookie.helper";
import { User } from "@/types/auth.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;

  signIn: (credentials: { identifier: string; remember: boolean }) => void;
  setUser: (data: User) => void;
  setUserMeta: (data: Pick<User, "role" | "username">) => void;
  logout: () => void;
};

const ACCESS_TOKEN_KEY = AUTH_TOKEN_KEYS.ACCESS_TOKEN;
const REFRESH_TOKEN_KEY = AUTH_TOKEN_KEYS.REFRESH_TOKEN;
const ROLE_COOKIE_KEY = "auth_role";

function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  role: string,
) {
  setCookie(ACCESS_TOKEN_KEY, accessToken);
  setCookie(REFRESH_TOKEN_KEY, refreshToken);
  setCookie(ROLE_COOKIE_KEY, role);
}

function clearAuthCookies() {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  deleteCookie(ROLE_COOKIE_KEY);
  deleteCookie("remember_account");
}

function persistUserToStorage(user: User) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("auth_user", JSON.stringify(user));
  }
}

function clearUserFromStorage() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("auth_user");
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signIn: ({ identifier, remember }) => {
        const username = identifier.trim() || "mai.anh@email.com";
        const user: User = {
          userId: 1,
          actorType: "USER",
          role: UserRoleEnum.USER,
          accessToken: `demo-access-${Date.now()}`,
          refreshToken: `demo-refresh-${Date.now()}`,
          username,
          vendorId: 0,
          vendorCode: "",
          vendorName: "",
        };
        const expires = remember ? 7 : 1 / 48;
        setCookie(ACCESS_TOKEN_KEY, user.accessToken, expires);
        setCookie(REFRESH_TOKEN_KEY, user.refreshToken, expires);
        setCookie(ROLE_COOKIE_KEY, user.role, expires);
        setCookie("remember_account", remember ? username : "", expires);
        persistUserToStorage(user);
        set({ user, isAuthenticated: true });
      },

      setUser: (data: User) => {
        setAuthCookies(data.accessToken, data.refreshToken, data.role);
        persistUserToStorage(data);
        set({ user: data, isAuthenticated: true });
      },

      setUserMeta: (data) => {
        set((state) => {
          if (!state.user) return state;

          const hasSameUserMeta =
            state.user.role === data.role &&
            state.user.username === data.username;

          if (hasSameUserMeta) return state;

          const nextUser: User = {
            ...state.user,
            role: data.role,
            username: data.username,
          };

          persistUserToStorage(nextUser);

          return {
            user: nextUser,
            isAuthenticated: true,
          };
        });
      },

      logout: () => {
        clearAuthCookies();
        clearUserFromStorage();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (
          typeof document === "undefined" ||
          typeof localStorage === "undefined"
        )
          return;

        const hasAccessToken = document.cookie
          .split(";")
          .some((c) => c.trim().startsWith(`${ACCESS_TOKEN_KEY}=`));

        if (!hasAccessToken) {
          state.user = null;
          state.isAuthenticated = false;
          clearUserFromStorage();
          return;
        }

        const stored = localStorage.getItem("auth_user");
        if (stored) {
          try {
            state.user = JSON.parse(stored);
          } catch {
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      },
    },
  ),
);

export const isUserRole = () => {
  const role = useAuthStore.getState().user?.role;
  return role === UserRoleEnum.USER;
};
