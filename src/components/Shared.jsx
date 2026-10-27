import { useState } from 'react';
import { Video } from 'lucide-react';
import { GROUP_NAME } from '../group';
export function Brand() { return <a className="brand" href="/" aria-label="ConnectUs trang chủ"><span className="brand-icon"><Video size={23}/></span>ConnectUs<span className="brand-dot">.</span></a>; }
export function Avatar({ name, photo }) {
  const [failed, setFailed] = useState(false);
  return photo && !failed ? <img className="avatar" src={photo} alt={name} referrerPolicy="no-referrer" onError={() => setFailed(true)}/> : <span className="avatar">{name?.charAt(0).toUpperCase() || '?'}</span>;
}
export function Footer() { return <footer><span>© 2026 ConnectUs</span><span>Kết nối gần hơn · {GROUP_NAME}</span></footer>; }
