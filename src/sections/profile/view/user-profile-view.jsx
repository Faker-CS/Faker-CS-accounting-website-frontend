/* eslint-disable import/no-unresolved */
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

// eslint-disable-next-line import/no-unresolved
import { paths } from 'src/routes/paths';

import { useAuth } from 'src/hooks/useAuth';
import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userFeeds, _userFriends } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useMockedUser } from 'src/auth/hooks';

import { ProfileHome } from '../profile-home';
import { ProfileCover } from '../profile-cover';
import { ProfileFriends } from '../profile-friends';
import { ProfileSettings } from '../profile-settings';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'profile', label: 'Profile', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  {
    value: 'settings',
    label: 'Update Profile',
    icon: <Iconify width={24} icon="solar:settings-bold" />,
  },
];

// ----------------------------------------------------------------------

export function UserProfileView() {
  const { user } = useMockedUser();
  const { userData } = useAuth();
  console.log('first', userData);

  const [searchFriends, setSearchFriends] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'profile';

  const tabs = useTabs(initialTab);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  const roleMap = {
    'comptable': 'Accountant',
    'aide-comptable': 'Assistant Accountant',
    'entreprise': 'Company',
  };
  let userRole = 'Accountant';
  if (userData?.roles) {
    if (Array.isArray(userData.roles) && userData.roles.length > 0) {
      userRole = roleMap[userData.roles[0]?.toLowerCase()] || userData.roles[0];
    } else if (typeof userData.roles === 'string') {
      userRole = roleMap[userData.roles?.toLowerCase()] || userData.roles;
    }
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Profile', href: paths.dashboard.profile },
          {
            name: userData?.name
              ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1)
              : '',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={userRole}
          name={
            userData?.name ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1) : ''
          }
          avatarUrl={`${import.meta.env.VITE_SERVER}/storage/${userData?.photo}`}
          coverUrl={_userAbout.coverUrl}
          
        />
        

        <Box
          display="flex"
          justifyContent={{ xs: 'center', md: 'flex-end' }}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { md: 3 },
            position: 'absolute',
            bgcolor: 'background.paper',
          }}
        >
          <Tabs value={tabs.value} onChange={tabs.onChange}>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Box>
      </Card>

      {tabs.value === 'profile' && <ProfileHome info={_userAbout} posts={_userFeeds} />}

      {tabs.value === 'friends' && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )}

      {tabs.value === 'settings' && <ProfileSettings />}

      {/* {tabs.value === 'gallery' && <ProfileGallery gallery={_userGallery} />} */}
    </DashboardContent>
  );
}
