import { useCallback } from 'react';
import { useAuth } from './useAuth';

export function useRoles() {
  const { user } = useAuth();

  const roles = user?.roles || [];

  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      const userRoles = user.roles || [];
      return userRoles.includes(role);
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roleList) => {
      if (!user) return false;
      const userRoles = user.roles || [];
      return roleList.some((role) => userRoles.includes(role));
    },
    [user]
  );

  const hasAllRoles = useCallback(
    (roleList) => {
      if (!user) return false;
      const userRoles = user.roles || [];
      return roleList.every((role) => userRoles.includes(role));
    },
    [user]
  );

  const isAdmin = hasRole('admin');
  const isUser = hasRole('user');

  return {
    roles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isUser,
  };
}
