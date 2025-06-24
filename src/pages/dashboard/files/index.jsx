/* eslint-disable import/no-unresolved */
/* eslint-disable perfectionist/sort-imports */
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import { CONFIG } from 'src/config-global';
import { paths } from 'src/routes/paths';
import { VerificationFilesView } from 'src/sections/verification-files/verification-files-view';

const metadata = { title: `Company Verification Files | Dashboard - ${CONFIG.appName}` };

export default function FilesPage() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.company_id) {
      navigate(paths.dashboard.files.company(userData.company_id));
    }
  }, [userData, navigate]);

  return (
    <>
        <Helmet>
        <title>{metadata.title}</title>
        </Helmet>
        <VerificationFilesView />
    </>
  );
} 