export async function requestRoom(user, room) {
  if (!user) throw new Error('Vui lòng đăng nhập trước khi vào phòng.');
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
    body: JSON.stringify({ room }),
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Không thể kết nối máy chủ cấp token. Kiểm tra backend và thử lại.');
  if (!data.token || !data.serverUrl) throw new Error('Máy chủ chưa trả về thông tin LiveKit hợp lệ.');
  return { ...data, room };
}
