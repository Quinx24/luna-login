import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider
} from "./firebase";
import "./App.css";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Đăng nhập Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      const result = await signInWithPopup(auth, googleProvider);

      setUser(result.user);
      setMessage("Đăng nhập Google thành công!");
    } catch (error) {
      console.error(error);
      setMessage("Đăng nhập Google thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập Facebook
  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      const result = await signInWithPopup(auth, facebookProvider);

      setUser(result.user);
      setMessage("Đăng nhập Facebook thành công!");
    } catch (error) {
      console.error(error);
      setMessage("Đăng nhập Facebook thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  // Đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setMessage("Bạn đã đăng xuất.");
    } catch (error) {
      console.error(error);
      setMessage("Không thể đăng xuất.");
    }
  };

  // Đăng nhập bằng email/mật khẩu hiện tại
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setMessage(
      "Giao diện đã nhận thông tin đăng nhập! Chưa kết nối máy chủ."
    );
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="visual-overlay" />

        <div className="brand">
          <span className="brand-symbol">L</span>
          <span>LUNA</span>
        </div>

        <div className="visual-content">
          <p className="eyebrow">A LITTLE SPARKLE, EVERY DAY</p>

          <h1>
            Your beauty,
            <br />
            your own story.
          </h1>

          <p className="visual-description">
            Những điều nhỏ bé cũng có thể làm nên
            <br />
            vẻ đẹp rất riêng của bạn.
          </p>
        </div>

        <p className="visual-footer">
          TIMELESS BEAUTY · EVERYDAY ELEGANCE
        </p>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-brand">
            <span className="brand-symbol">L</span>
            LUNA
          </div>

          {!user ? (
            <>
              <p className="welcome-label">
                CHÀO MỪNG BẠN TRỞ LẠI
              </p>

              <h2>Đăng nhập</h2>

              <p className="subtitle">
                Đăng nhập để khám phá thế giới trang sức
                của riêng bạn.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>

                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="password">
                      Mật khẩu
                    </label>

                    <a href="#forgot-password">
                      Quên mật khẩu?
                    </a>
                  </div>

                  <div className="password-field">
                    <input
                      id="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      placeholder="Nhập mật khẩu của bạn"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      autoComplete="current-password"
                      required
                    />

                    <button
                      className="toggle-password"
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "ẨN" : "HIỆN"}
                    </button>
                  </div>
                </div>

                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(e.target.checked)
                    }
                  />

                  <span>Ghi nhớ đăng nhập</span>
                </label>

                {message && (
                  <p className="form-message">
                    {message}
                  </p>
                )}

                <button
                  className="login-button"
                  type="submit"
                >
                  ĐĂNG NHẬP <span>→</span>
                </button>
              </form>

              <div className="divider">
                <span>HOẶC</span>
              </div>

              {/* GOOGLE LOGIN */}
              <button
                type="button"
                className="google-button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <span className="google-icon">G</span>

                {loading
                  ? "ĐANG ĐĂNG NHẬP..."
                  : "ĐĂNG NHẬP VỚI GOOGLE"}
              </button>

              {/* FACEBOOK LOGIN */}
              <button
                type="button"
                className="facebook-button"
                onClick={handleFacebookLogin}
                disabled={loading}
              >
                <span className="facebook-icon">f</span>

                {loading
                  ? "ĐANG ĐĂNG NHẬP..."
                  : "ĐĂNG NHẬP VỚI FACEBOOK"}
              </button>

              <p className="register-text">
                Bạn chưa có tài khoản?
                <a href="#register"> Đăng ký ngay</a>
              </p>

              <p className="terms">
                Bằng việc tiếp tục, bạn đồng ý với Điều khoản
                dịch vụ và Chính sách bảo mật của chúng tôi.
              </p>
            </>
          ) : (
            /* SAU KHI ĐĂNG NHẬP */
            <div className="user-profile">
              <p className="welcome-label">
                ĐĂNG NHẬP THÀNH CÔNG
              </p>

              <h2>Xin chào!</h2>

              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="user-avatar"
                />
              )}

              <h3>{user.displayName}</h3>

              <p className="user-email">
                {user.email}
              </p>

              <div className="group-info">
                <p className="group-title">NHÓM 15</p>

                <div className="group-members">
                  <p>
                    <strong>Thành viên 1:</strong> Võ Thị Kiều Thơ
                  </p>

                  <p>
                    <strong>Thành viên 2:</strong> Nguyễn Thị Hoàng Uyên
                  </p>
                </div>
              </div>

              <button
                className="login-button"
                type="button"
                onClick={handleLogout}
              >
                ĐĂNG XUẤT
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;