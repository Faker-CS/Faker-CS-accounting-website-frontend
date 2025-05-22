import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { useAuth } from 'src/hooks/useAuth';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

// eslint-disable-next-line import/no-cycle
import { RoleBasedGuard } from '.';
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export function AuthGuard({ children }) {
  const router = useRouter();
  const { userData } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { authenticated, loading } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);
  const [showRoleGuard, setShowRoleGuard] = useState(false);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const checkPermissions = async () => {
      if (loading) return;
      if (!authenticated) {
        const { method } = CONFIG.auth;
        const signInPath = {
          jwt: paths.auth.jwt.signIn,
          auth0: paths.auth.auth0.signIn,
          amplify: paths.auth.amplify.signIn,
          firebase: paths.auth.firebase.signIn,
          supabase: paths.auth.supabase.signIn,
        }[method];
        const href = `${signInPath}?${createQueryString('returnTo', pathname)}`;
        router.replace(href);
        return;
      }
      // Check for restricted paths and roles
      const restrictedPaths = [paths.dashboard.root, paths.dashboard.group.root];
      if (restrictedPaths.includes(pathname)) {
        const userRoles = Array.isArray(userData?.roles)
          ? userData.roles
          : userData?.roles
            ? [userData.roles]
            : [];
        const hasRequiredRole = userRoles.some((role) =>
          ['comptable', 'aide-comptable'].includes(role)
        );
        if (!hasRequiredRole) {
          setShowRoleGuard(true);
          setIsChecking(false);
          return;
        }
      }
      setShowRoleGuard(false);
      setIsChecking(false);
    };
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading, userData, pathname]);

  if (isChecking || loading || !userData) {
    return <SplashScreen />;
  }

  if (!isChecking && authenticated && showRoleGuard) {
    // Do NOT render children if user lacks required role
    return (
      <RoleBasedGuard
        hasContent
        currentRole={userData?.roles?.[0]}
        acceptRoles={['comptable', 'aide-comptable']}
      />
    );
  }

  return <>{children}</>;
}
