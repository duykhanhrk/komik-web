import NotificationsSystem, {atalhoTheme, useNotifications, setUpNotifications} from 'reapop';

setUpNotifications({
  defaultProps: {
    position: 'top-right',
    dismissible: true,
    dismissAfter: 3000
  } 
});

function AppNotificationsSystem() {
  const {notifications, dismissNotification} = useNotifications();

  return (
    <NotificationsSystem
      notifications={notifications}
      dismissNotification={(id) => dismissNotification(id)}
      theme={atalhoTheme}
    />
  )
}

export default AppNotificationsSystem;
