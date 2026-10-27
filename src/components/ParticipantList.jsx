import { useParticipants } from '@livekit/components-react';
import { Avatar } from './Shared';
export default function ParticipantList() {
  const participants = useParticipants();
  return <aside className="participants panel"><h2>Người tham gia · {participants.length}</h2>{participants.map(p => { let metadata = {}; try { metadata = JSON.parse(p.metadata || '{}'); } catch { /* Metadata từ client khác có thể không phải JSON. */ } const name = p.name || p.identity; return <div className="member" key={p.sid || p.identity}><Avatar name={name} photo={metadata.photoURL}/><div><strong>{name}{p.isLocal ? ' (Bạn)' : ''}</strong><p>{p.isMicrophoneEnabled ? 'Micro bật' : 'Micro tắt'} · {p.isCameraEnabled ? 'Camera bật' : 'Camera tắt'}</p></div></div>; })}</aside>;
}
