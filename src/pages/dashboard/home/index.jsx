import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import HomePageView from 'src/sections/home/view/home-page-view';

// ----------------------------------------------------------------------

const metadata = { title: `Home - ${CONFIG.appName}` };

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

    <HomePageView />
    </>
  );
}