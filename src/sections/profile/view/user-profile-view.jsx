import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useAuth } from 'src/hooks/useAuth';
import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useMockedUser } from 'src/auth/hooks';

import { ProfileHome } from '../profile-home';
import { ProfileCover } from '../profile-cover';
import { ProfileFriends } from '../profile-friends';
import { ProfileGallery } from '../profile-gallery';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'profile', label: 'Profile', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  {
    value: 'companies',
    label: 'Companies',
    icon: <Iconify width={24} icon="ic:round-business" />,
  },
  {
    value: 'tasks',
    label: 'Tasks',
    icon: <Iconify width={24} icon="ic:round-task"/>,
  },
];

// ----------------------------------------------------------------------

export function UserProfileView() {
  const { user } = useMockedUser();
  const { userData } = useAuth();
  console.log("first", userData);

  const [searchFriends, setSearchFriends] = useState('');

  const tabs = useTabs('profile');

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Profile', href: paths.dashboard.profile },
          { name: userData?.name ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1) : '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={ userData?.roles && userData.roles.comptable === true ? 'Comptable' : 'Accounter' }
          name={userData?.name ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1) : '' }
          avatarUrl={user?.photoURL}
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

      {/* {tabs.value === 'gallery' && <ProfileGallery gallery={_userGallery} />} */}
    </DashboardContent>
  );
}
