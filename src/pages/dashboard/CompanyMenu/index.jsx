import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import HomePageView from 'src/sections/client/home/home-page-view';


// ----------------------------------------------------------------------

const metadata = { title: `Menu - ${CONFIG.appName}` };

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