/* eslint-disable perfectionist/sort-imports */
import { Helmet } from 'react-helmet-async';
// eslint-disable-next-line perfectionist/sort-imports
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import { CONFIG } from 'src/config-global';
import { CompanyFilesView } from 'src/sections/file-manager/view/company-files-view';

// ----------------------------------------------------------------------

const metadata = { title: `Files | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.company_id) {
      navigate(`/dashboard/files/company/${userData.company_id}`);
    }
  }, [userData, navigate]);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <CompanyFilesView />
    </>
  );
}
