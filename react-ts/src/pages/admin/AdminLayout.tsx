import { useState } from 'react';
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
  type LucideIcon
} from 'lucide-react';

// Компонент обгортки адмін-панелі
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user] = useState({ name: 'Адміністратор', role: 'Admin' });

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
    // Логіка виходу
    console.log('Logout');
    // window.location.href = '/';
  };

  // Вміст різних сторінок
  const renderPageContent = () => {
    switch(currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'users':
        return <UsersPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
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
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-4 py-3 hover:bg-blue-800 transition-colors ${
                currentPage === item.id ? 'bg-blue-800 border-l-4 border-white' : ''
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
              {menuItems.find(item => item.id === currentPage)?.label || 'Дашборд'}
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
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

// Приклад сторінки Дашборд
const DashboardPage = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Користувачі" value="1,234" icon={Users} color="blue" />
      <StatCard title="Категорії" value="45" icon={FolderOpen} color="green" />
      <StatCard title="Товари" value="892" icon={Package} color="purple" />
      <StatCard title="Замовлення" value="156" icon={ShoppingCart} color="orange" />
    </div>
    
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Останні дії</h3>
      <p className="text-gray-600">Тут буде список останніх дій в системі...</p>
    </div>
  </div>
);

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

// Приклад сторінки Користувачі
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

// Приклад сторінки Категорії
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

// Приклад сторінки Товари
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

// Приклад сторінки Замовлення
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

// Приклад сторінки Аналітика
const AnalyticsPage = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Графіки та статистика</h3>
      <p className="text-gray-600">Тут будуть графіки продажів, трафіку тощо</p>
    </div>
  </div>
);

// Приклад сторінки Налаштування
const SettingsPage = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Налаштування системи</h3>
    <p className="text-gray-600">Тут будуть загальні налаштування</p>
  </div>
);

export default AdminLayout;