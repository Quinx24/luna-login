import { lazy, Suspense, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, firebaseConfigured } from './firebase';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
const MeetingRoom = lazy(() => import('./components/MeetingRoom'));
import { requestRoom } from './livekitService';
import './App.css';
export default function App() {
const [user, setUser] = useState(auth?.currentUser);
const [ready, setReady] = useState(!auth);
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(false);
const [session, setSession] = useState(null);
useEffect(() => auth ? onAuthStateChanged(auth, next => { setUser(next); setReady(true); if (!next) setSession(null); }) : undefined, []);
  // Đăng nhập Google bằng Firebase
  async function handleGoogleLogin() {
    setLoading(true);
    setMessage("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Google login error:", error);
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  // Đăng nhập Facebook bằng Firebase
  async function handleFacebookLogin() {
    setLoading(true);
    setMessage("");

    try {
      const result = await signInWithPopup(auth, facebookProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Facebook login error:", error);
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  // Hiển thị thông báo lỗi dễ hiểu
  function getErrorMessage(error) {
    if (error.code === "auth/popup-closed-by-user") {
      return "Bạn đã đóng cửa sổ đăng nhập.";
    }

    if (error.code === "auth/popup-blocked") {
      return "Trình duyệt đã chặn cửa sổ đăng nhập. Hãy cho phép popup.";
    }

    if (
      error.code === "auth/account-exists-with-different-credential"
    ) {
      return "Email này đã được sử dụng với một phương thức đăng nhập khác.";
    }

    if (error.code === "auth/invalid-credential") {
      return "Thông tin xác thực không hợp lệ. Hãy kiểm tra cấu hình nhà cung cấp đăng nhập.";
    }

    return error.message || "Đăng nhập thất bại. Vui lòng thử lại.";
  }

  // Đăng xuất Firebase
  async function handleLogout() {
    try {
      await signOut(auth);
      setUser(null);
      setSession(null);
      setMessage("");
    } catch (error) {
      console.error("Logout error:", error);
      setMessage("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  }


async function joinRoom(room) {
setLoading(true); setMessage('');
try { const next = await requestRoom(user, room); if (auth.currentUser?.uid === user.uid) setSession(next); }
catch (error) { setMessage(error.name === 'TimeoutError' ? 'Máy chủ phản hồi quá lâu. Hãy thử lại.' : error.message); }
finally { setLoading(false); }
}
if (!ready) return <main className="loading-page" role="status">Đang khôi phục phiên đăng nhập…</main>;
if (!user) return <LoginPage loading={loading} message={message} configured={firebaseConfigured} onGoogle={handleGoogleLogin} onFacebook={handleFacebookLogin}/>;
if (session) return <Suspense fallback={<main className="loading-page" role="status">Đang tải phòng họp…</main>}><MeetingRoom session={session} onLeave={() => setSession(null)} onLogout={handleLogout} message={message}/></Suspense>;
return <HomePage user={user} onLogout={handleLogout} onJoin={joinRoom} loading={loading} message={message}/>;
}
