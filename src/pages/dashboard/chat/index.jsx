import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// import { ChatView } from 'src/sections/chat/view';
import { ComptableChat } from 'src/sections/chat/view/comptable-chat';
// ----------------------------------------------------------------------

const metadata = { title: `Chat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ComptableChat />
    </>
  );
}
