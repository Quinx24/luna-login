import { useState } from 'react';
import { LiveKitRoom, VideoConference, useConnectionState } from '@livekit/components-react';
import '@livekit/components-styles';
import ParticipantList from './ParticipantList';
import { Brand } from './Shared';
function Status() { const state = useConnectionState(); return <span role="status">{({ connected: 'Đã kết nối', connecting: 'Đang kết nối…', reconnecting: 'Đang kết nối lại…', disconnected: 'Đã ngắt kết nối', signalReconnecting: 'Đang khôi phục kết nối…' })[state] || state}</span>; }
export default function MeetingRoom({ session, onLeave, onLogout, message }) {
  const [error, setError] = useState('');
  return <main className="app-page"><header><Brand/><button onClick={onLogout}>Đăng xuất</button></header><div className="room-heading"><div><p className="eyebrow">PHÒNG HỌP CONNECTUS</p><h1>{session.room}</h1><p>Gửi tên phòng này cho người bạn muốn mời.</p></div><button onClick={onLeave}>Về trang chủ</button></div>{(error || message) && <div className="error" role="alert">{error || message}</div>}<LiveKitRoom token={session.token} serverUrl={session.serverUrl} connect audio={false} video={false} onDisconnected={onLeave} onError={e => setError(`Không thể kết nối cuộc gọi: ${e.message}`)} onMediaDeviceFailure={() => setError('Không thể sử dụng thiết bị. Kiểm tra quyền camera/micro và thử bật lại.')} data-lk-theme="default"><div className="connection-status"><Status/><span>Bật camera và micro trên thanh điều khiển khi sẵn sàng.</span></div><div className="meeting-grid"><VideoConference/><ParticipantList/></div></LiveKitRoom></main>;
}
