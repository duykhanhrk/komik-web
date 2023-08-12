import {isAxiosError} from "axios";
import {UseMutationResult} from "react-query";
import {NotificationsContext} from "reapop/dist/contexts/reapopNotificationsContext";

export function deleteConfirmHelper({
  noti,
  onConfirm,
  title,
  message
}:{
  noti: NotificationsContext,
  onConfirm?: () => Promise<any>,
  title?: string,
  message?: string
}) {
  const notification = noti.notify({
    title: title || 'Xác nhận',
    message: message || 'Bạn có chắc chắn muốn xóa?',
    status: 'info',
    dismissible: false,
    dismissAfter: 5000
  });

  notification.dismissible = true;
  notification.dismissAfter = 5000;
  notification.buttons = [
    {
      name: 'Xác nhận',
      onClick: async () => {onConfirm?.(); noti.dismissNotification(notification.id);}
    },
  ]
  noti.notify(notification);
}

export async function actCUDHelper(
  act: UseMutationResult<any, any, any, any>,
  noti: NotificationsContext,
  type: 'create' | 'update' | 'delete', 
  actVariable?: unknown
) {
  const notification = noti.notify({
    title: 'Thực thi',
    message: type === 'create' ? 'Đang tạo...' : type === 'update' ? 'Đang cập nhật...' : 'Đang xóa...',
    status: 'loading',
    dismissible: false
  });

  try {
    await act.mutateAsync(actVariable);

    notification.title = 'Thành công'
    notification.status = 'success';
    notification.message = type === 'create' ? 'Tạo thành công' : type === 'update' ? 'Cập nhật thành công' : 'Xóa thành công';
    notification.dismissible = true;
    notification.dismissAfter = 3000;
    noti.notify(notification);
  } catch(error) {
    if (isAxiosError(error) && error.response) {
      notification.message = error.response.data.message;
    } else {
      notification.message = 'Có lỗi xảy ra, xin thử lại sau';
    }

    notification.title = 'Lỗi'
    notification.status = 'error';
    notification.dismissible = true;
    notification.dismissAfter = 3000;

    noti.notify(notification);

    return Promise.reject();
  }

  return Promise.resolve();
}
