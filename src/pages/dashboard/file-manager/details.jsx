import React from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CompanyFilesView } from 'src/sections/file-manager/view/company-files-view';

const metadata = { title: `File manager | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CompanyFilesView />
    </>
  );
}
