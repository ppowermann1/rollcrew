// Layout — 공통 레이아웃
import { Outlet } from 'react-router-dom';
import TabBar from './TabBar';

export default function Layout() {
  return (
    <div className="page-container">
      {/* 필름 그레인 오버레이 */}
      <div className="film-grain" />

      {/* 페이지 콘텐츠 - Outlet으로 자식 라우트 렌더링 */}
      <Outlet />

      {/* 하단 탭바 */}
      <TabBar />
    </div>
  );
}
