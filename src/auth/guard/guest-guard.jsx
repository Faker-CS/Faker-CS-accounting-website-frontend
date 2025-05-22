import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuth } from 'src/hooks/useAuth';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export function GuestGuard({ children }) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { loading, authenticated } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const { userData } = useAuth();

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    if (authenticated) {
      try {
        // Redirect based on user role
        if (userData.roles?.includes('entreprise')) {
          router.replace(paths.dashboard.companyMenu.root);
        } else {
          router.replace(paths.dashboard.root);
        }
        return;
      } catch (error) {
        console.error('Error checking user role:', error);
        router.replace(returnTo);
        return;
      }
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
