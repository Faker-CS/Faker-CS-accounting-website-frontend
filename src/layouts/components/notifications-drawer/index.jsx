import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useAuth } from 'src/hooks/useAuth';
import { useBoolean } from 'src/hooks/use-boolean';

import { initializeEcho, subscribeToNotifications } from 'src/actions/echo';
import { handleRead, handleDelete, handleAllRead, useGetNotifications } from 'src/actions/notifications';

import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { Scrollbar } from 'src/components/scrollbar';

import { NotificationItem } from './notification-item';

// ----------------------------------------------------------------------

function mapServiceLinkToFrontend(link) {
  // Example: /dashboard/forms/123  -->  /dashboard/demandes/123/demands
  const formMatch = link.match(/^\/dashboard\/forms\/(\d+)$/);
  if (formMatch) {
    const id = formMatch[1];
    return `/dashboard/demandes/${id}/demands`;
  }
  // Add more mappings as needed
  return link; // fallback to original if no mapping needed
}

export function NotificationsDrawer({ sx, ...other }) {
  const { userData } = useAuth();
  const drawer = useBoolean();
  const { notificationsData, mutateNotifications } = useGetNotifications();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  // handle real-time notifications
  const handleNewNotification = useCallback((newNotification) => {
    setNotifications((prev) => {
      // Check if notification already exists
      const exists = prev.some((n) => n.id === newNotification.id);
      if (exists) return prev;

      return [
        {
          ...newNotification,
          isUnRead: 1,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  }, []);

  // initialize Echo and subscribe to notifications
  useEffect(() => {
    if (!userData?.id) return;

    const echo = initializeEcho();
    const channel = subscribeToNotifications(echo, userData?.id, handleNewNotification);

    // eslint-disable-next-line consistent-return
    return () => {
      if (channel) {
        channel.stopListening('.new-notification');
      }
      echo.disconnect();
    };
  }, [userData?.id, handleNewNotification]);

  // Initialize notifications from API data
  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData);
    }
  }, [notificationsData]);

  const totalUnRead = notifications?.filter((item) => item.isUnRead === 1).length;

  const handleMarkAllAsRead = () => {
    handleAllRead(mutateNotifications);
    setNotifications(notifications.map((notification) => ({ ...notification, isUnRead: false })));
  };

  const handleNotificationClick = (notification) => {
    handleRead(notification.id, mutateNotifications);
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, isUnRead: false } : n
      )
    );
    
    // Check if user has the required role
    const allowedRoles = ['comptable', 'aide-comptable'];
    const userRole = userData?.roles;
    
    if (notification.serviceLink && allowedRoles.includes(userRole)) {
      const mappedLink = mapServiceLinkToFrontend(notification.serviceLink);
      navigate(mappedLink);
    }
    
    setTimeout(() => {
      handleDelete(notification.id, mutateNotifications);
    }, 300000); // 5 minutes
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Marquer tous comme lus">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={drawer.onFalse} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderList = (
    <Scrollbar>
      <Box component="ul">
        {notifications?.map((notification) => (
          <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
            <NotificationItem
              notification={notification}
              handleMark={() => handleNotificationClick(notification)}
            />
          </Box>
        ))}
      </Box>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={drawer.onTrue}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <SvgIcon>
            {/* https://icon-sets.iconify.design/solar/bell-bing-bold-duotone/ */}
            <path
              fill="currentColor"
              d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
              opacity="0.5"
            />
            <path
              fill="currentColor"
              d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
            />
          </SvgIcon>
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 1, maxWidth: 420 } }}
      >
        {renderHead}

        {renderList}
      </Drawer>
    </>
  );
}
