/* eslint-disable import/no-unresolved */
import useSWR, { mutate } from 'swr';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/hooks/useAuth';
import { useResponsive } from 'src/hooks/use-responsive';

import { today } from 'src/utils/format-time';

import { createConversation, useGetConversations } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';

import { ToggleButton } from './styles';
import { ChatNavItem } from './chat-nav-item';
import { ChatNavAccount } from './chat-nav-account';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { ChatNavSearchResults } from './chat-nav-search-results';
import { initialConversation } from './utils/initial-conversation';

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

export function ChatNav({ contacts, collapseNav, selectedConversationId }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { userData } = useAuth();

  const { conversations, conversationsLoading, conversationsError, loadNextPage, isLastPage } = useGetConversations(userData?.id);

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    onCollapseDesktop,
  } = collapseNav;

  const [searchContacts, setSearchContacts] = useState({
    query: '',
    results: [],
  });

  const myContact = useMemo(
    () => ({
      id: `${userData?.id}`,
      role: `${userData?.role}`,
      email: `${userData?.email}`,
      address: `${userData?.address}`,
      name: `${userData?.name}`,
      lastActivity: today(),
      avatarUrl: `${userData?.photoURL}`,
      phoneNumber: `${userData?.phoneNumber}`,
      status: 'online',
    }),
    [userData]
  );

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  const handleClickCompose = useCallback(() => {
    if (!mdUp) {
      onCloseMobile();
    }
    router.push(paths.dashboard.chat);
  }, [mdUp, onCloseMobile, router]);

  const handleSearchContacts = useCallback(
    (inputValue) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

      if (inputValue) {
        // Filter contacts based on user role and permissions
        const results = contacts.filter((contact) => {
          const nameMatch = contact?.name?.toLowerCase().includes(inputValue.toLowerCase());
          
          // Additional role-based filtering
          switch (userData?.role) {
            case 'comptable':
              // Comptable can chat with all aide-comptables and companies
              return nameMatch && (contact.role === 'aide-comptable' || contact.role === 'company');
            
            case 'aide-comptable':
              // Aide-comptable can chat with their responsible companies and main comptable
              if (contact.role === 'comptable') return nameMatch;
              if (contact.role === 'company') {
                return nameMatch && contact.aide_comptable_id === userData.id;
              }
              return false;
            
            case 'company':
              // Company can only chat with their assigned aide-comptable and main comptable
              if (contact.role === 'comptable') return nameMatch;
              if (contact.role === 'aide-comptable') {
                return nameMatch && userData.aide_comptable_id === contact.id;
              }
              return false;
            
            default:
              return false;
          }
        });

        setSearchContacts((prevState) => ({ ...prevState, results }));
      }
    },
    [contacts, userData]
  );
  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  const handleClickResult = useCallback(
    async (result) => {
      try {
        handleClickAwaySearch();

        // Check if the conversation already exists
        if (conversations.allIds.includes(result.id)) {
          router.push(`${paths.dashboard.chat}?id=${result.id}`);
          return;
        }

        // Find the recipient in contacts
        const recipient = contacts.find((contact) => contact.id === result.id);
        if (!recipient) {
          console.error('Recipient not found');
          return;
        }

        // Prepare conversation data
        const { conversationData } = initialConversation({
          recipients: [recipient],
          me: myContact,
        });

        // Create a new conversation
        const res = await createConversation(conversationData);

        if (!res || !res.id) {
          console.error('Failed to create conversation');
          return;
        }

        // Navigate to the new conversation
        router.push(`${paths.dashboard.chat}?id=${res.id}`);

        // Revalidate conversations list
        mutate('/api/conversations');

      } catch (error) {
        console.error('Error handling click result:', error);
      }
    },
    [contacts, conversations.allIds, handleClickAwaySearch, myContact, router]
  );

  const renderLoading = <ChatNavItemSkeleton />;

  const renderList = (
    <nav>
      <Box component="ul">
        {conversations?.allIds?.map((conversationId) => (
          <ChatNavItem
            key={conversationId}
            collapse={collapseDesktop}
            conversation={conversations?.byId?.[conversationId]}
            selected={conversationId === selectedConversationId}
            onCloseMobile={onCloseMobile}
          />
        ))}
      </Box>
      {!conversationsLoading && !isLastPage && conversations?.allIds.length > 0 && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Button variant="outlined" onClick={loadNextPage}>
            Load More
          </Button>
        </Box>
      )}
      {conversationsLoading && conversations?.allIds.length > 0 && (
         <Box sx={{ p: 2, textAlign: 'center' }}>
            <CircularProgress size={24} />
         </Box>
      )}
    </nav>
  );

  const renderListResults = (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
        onChange={(event) => handleSearchContacts(event.target.value)}
        placeholder="Search contacts..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );

  const renderContent = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ p: 2.5, pb: 0 }}>
        {!collapseDesktop && (
          <>
            <ChatNavAccount />
            <Box sx={{ flexGrow: 1 }} />
          </>
        )}

        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={collapseDesktop ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
          />
        </IconButton>

        {!collapseDesktop && (
          <IconButton onClick={handleClickCompose}>
            <Iconify width={24} icon="solar:user-plus-bold" />
          </IconButton>
        )}
      </Stack>

      <Box sx={{ p: 2.5, pt: 0 }}>{!collapseDesktop && renderSearchInput}</Box>

      {conversationsLoading ? (
        renderLoading
      ) : (
        <Scrollbar sx={{ pb: 1 }}>
          {searchContacts.query ? renderListResults : renderList}
        </Scrollbar>
      )}
    </>
  );

  return (
    <>
      <ToggleButton onClick={onOpenMobile} sx={{ display: { md: 'none' } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ToggleButton>

      <Stack
        sx={{
          minHeight: 0,
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', md: 'flex' },
          borderRight: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: NAV_COLLAPSE_WIDTH }),
        }}
      >
        {renderContent}
      </Stack>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
