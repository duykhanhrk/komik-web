import {useMemo} from 'react';
import NotificationsSystem, {atalhoTheme, Notification, useNotifications, setUpNotifications, Theme, baseTheme} from 'reapop';
import {useTheme} from 'styled-components';

setUpNotifications({
  defaultProps: {
    position: 'top-right',
    dismissible: true,
    dismissAfter: 3000
  } 
});


const lineHeight = 1.428571429

function AppNotificationsSystem() {
  const {notifications, dismissNotification} = useNotifications();
  const theme = useTheme();

  const colorPerStatus = useMemo(() => {
    return {
      ['none']: theme.colors.themeColor,
      ['info']: theme.colors.blue,
      ['loading']: theme.colors.themeColor,
      ['success']: theme.colors.green,
      ['warning']: theme.colors.orange,
      ['error']: theme.colors.red,
    }
  }, [theme]);

  const customTheme: Theme = useMemo(() => {
    return {
      ...baseTheme,
      notification: (notification: Notification) => ({
          display: 'flex',
          width: '340px',
          height: '100%',
          position: 'relative',
          borderRadius: '8px',
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
          backgroundColor: theme.colors.secondaryBackground,
          color: theme.colors.foreground,
          marginBottom: '16px',
          cursor: notification.dismissible && !notification.showDismissButton ? 'pointer' : '',
          zIndex: 999,
          overflow: 'hidden'
      }),
      notificationIcon: (notification: Notification) => ({
          display: notification.image ? 'none' : 'flex',
          width: '20px',
          height: '20px',
          boxSizing: 'border-box',
          margin: '10px 0 10px 15px',
          alignSelf: 'center',
          flexShrink: 0,
          color: colorPerStatus[notification.status],
      }),
      notificationDismissIcon: () => ({
          width: '12px',
          height: '12px',
          margin: '14px 10px',
          cursor: 'pointer',
          color: '#b9c2cb',
          flexShrink: 0,
      }),
      notificationMeta: () => ({
          verticalAlign: 'top',
          boxSizing: 'border-box',
          width: '100%',
          padding: '10px 20px'
      }),
      notificationTitle: (notification) => ({
          margin: notification.message ? '0 0 10px' : 0,
          fontSize: '14px',
          color: theme.colors.foreground,
          fontWeight: 700,
          lineHeight,
      }),
      notificationMessage: () => ({
          margin: 0,
          fontSize: '14px',
          color: theme.colors.secondaryForeground,
          lineHeight,
      }),
      notificationImageContainer: () => ({
          boxSizing: 'border-box',
          padding: '10px 0 10px 15px',
      }),
      notificationImage: () => ({
          display: 'inline-flex',
          borderRadius: '40px',
          width: '40px',
          height: '40px',
          backgroundSize: 'cover',
      }),
      notificationButtons: () => ({
      }),
      notificationButton: (
          notification: Notification,
          position: number,
          state: {isHovered: boolean; isActive: boolean},
      ) => ({
          display: 'block',
          width: '100%',
          height: `${100 / notification.buttons.length}%`,
          minHeight: '40px',
          boxSizing: 'border-box',
          padding: 0,
          background: `${theme.colors.red}22`,
          border: 'none',
          outline: 'none',
          textAlign: 'center',
          color: state.isHovered || state.isActive ? theme.colors.red : theme.colors.red,
          cursor: 'pointer',
          fontWeight: 'bold'
      }),
      notificationButtonText: () => ({
          display: 'block',
          height: '25px',
          padding: '0 15px',
          minWidth: '90px',
          maxWidth: '150px',
          width: 'auto',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          margin: '0 auto',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          fontSize: '14px',
          lineHeight: '25px',
      }),
    }
  }, [theme]);

  return (
    <NotificationsSystem
      notifications={notifications}
      dismissNotification={(id) => dismissNotification(id)}
      theme={customTheme}
    />
  )
}

export default AppNotificationsSystem;
