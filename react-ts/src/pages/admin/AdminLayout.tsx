import { useState } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Package,
  ShoppingCart,
  BarChart3,
  Clock,
  Trash2,
  type LucideIcon
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { 
  useGetStatsQuery, 
  useGetRecentActivitiesQuery,
  type RecentActivity
} from '../../services/apiDashboard';
import { useGetUsersQuery, useDeleteUserMutation } from '../../services/apiUsers';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../services/apiCategory';

interface JwtPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/name'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/emailaddress'?: string;
}

// Компонент обгортки адмін-панелі
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Отримуємо дані користувача з токена
  const getUserData = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        return {
          name: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/name'] || 'Адміністратор',
          email: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/emailaddress'] || '',
          role: 'Admin'
        };
      } catch {
        return { name: 'Адміністратор', email: '', role: 'Admin' };
      }
    }
    return { name: 'Адміністратор', email: '', role: 'Admin' };
  };

  const user = getUserData();

  // Меню навігації
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд', path: '/admin' },
    { id: 'users', icon: Users, label: 'Користувачі', path: '/admin/users' },
    { id: 'categories', icon: FolderOpen, label: 'Категорії', path: '/admin/categories' },
    { id: 'products', icon: Package, label: 'Товари', path: '/admin/products' },
    { id: 'orders', icon: ShoppingCart, label: 'Замовлення', path: '/admin/orders' },
    { id: 'analytics', icon: BarChart3, label: 'Аналітика', path: '/admin/analytics' },
    { id: 'settings', icon: Settings, label: 'Налаштування', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login', { replace: true });
  };

  const getCurrentPage = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Дашборд';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-blue-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-blue-800">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Адмін Панель</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-blue-800 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-3 hover:bg-blue-800 transition-colors ${
                location.pathname === item.path ? 'bg-blue-800 border-l-4 border-white' : ''
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-blue-800 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 hover:bg-blue-800 rounded transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && (
              <span className="ml-3 text-sm font-medium">Вийти</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {getCurrentPage()}
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Оновлена сторінка Дашборд з реальними даними
const DashboardPage = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetStatsQuery();
  const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useGetRecentActivitiesQuery();

  console.log('📊 Dashboard Stats:', { stats, statsLoading, statsError });
  console.log('📋 Dashboard Activities:', { activities, activitiesLoading, activitiesError });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Помилка завантаження статистики</h3>
        <p className="text-red-600 text-sm">{JSON.stringify(statsError)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статистичні картки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Користувачі" 
          value={stats?.usersCount.toString() || '0'} 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          title="Категорії" 
          value={stats?.categoriesCount.toString() || '0'} 
          icon={FolderOpen} 
          color="green" 
        />
        <StatCard 
          title="Товари" 
          value={stats?.productsCount.toString() || '0'} 
          icon={Package} 
          color="purple" 
        />
        <StatCard 
          title="Замовлення" 
          value={stats?.ordersCount.toString() || '0'} 
          icon={ShoppingCart} 
          color="orange" 
        />
      </div>
      
      {/* Останні дії */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Останні дії</h3>
        
        {activitiesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity: RecentActivity, index: number) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                <div className={`
                  p-2 rounded-lg
                  ${activity.icon === 'user' ? 'bg-blue-100' : 'bg-green-100'}
                `}>
                  {activity.icon === 'user' ? (
                    <Users className="text-blue-600" size={20} />
                  ) : (
                    <FolderOpen className="text-green-600" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {new Date(activity.timestamp).toLocaleString('uk-UA')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">Немає останніх дій</p>
        )}
      </div>
    </div>
  );
};

// Компонент статистичної картки
interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => {
  const colors: Record<StatCardProps['color'], string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${colors[color]} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
};

// Інші сторінки (без змін)
const UsersPage = () => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Список користувачів</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Додати користувача
        </button>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Тут буде таблиця з користувачами та CRUD операціями</p>
    </div>
  </div>
);

const CategoriesPage = () => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Список категорій</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Додати категорію
        </button>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Тут буде таблиця з категоріями та CRUD операціями</p>
    </div>
  </div>
);

const ProductsPage = () => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Список товарів</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Додати товар
        </button>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Тут буде таблиця з товарами та CRUD операціями</p>
    </div>
  </div>
);

const OrdersPage = () => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold">Список замовлень</h3>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Тут буде таблиця із замовленнями</p>
    </div>
  </div>
);

const AnalyticsPage = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Графіки та статистика</h3>
      <p className="text-gray-600">Тут будуть графіки продажів, трафіку тощо</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Налаштування системи</h3>
    <p className="text-gray-600">Тут будуть загальні налаштування</p>
  </div>
);

export default AdminLayout;