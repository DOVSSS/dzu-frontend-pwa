import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import {type Order,type OrderStatus } from '../types/api.types';

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Ожидает подтверждения', color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Подтверждён', color: 'bg-blue-100 text-blue-700' },
  DELIVERING: { label: 'В пути', color: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Доставлен', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Отменён', color: 'bg-red-100 text-red-700' },
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch {
        setError('Не удалось загрузить заказы');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
          >
            ← Назад
          </button>
          <h1 className="text-lg font-bold text-gray-900">Мои заказы</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900">Заказов пока нет</h2>
            <p className="text-gray-500 mt-2">Оформите первый заказ</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              Перейти к ресторанам
            </button>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">

                {/* Шапка заказа */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-gray-900">#{order.reference}</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].label}
                  </span>
                </div>

                {/* Товары */}
                <div className="space-y-2 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-400">{item.quantity} шт.</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                        {item.price * item.quantity} ₽
                      </p>
                    </div>
                  ))}
                </div>

                {/* Итого */}
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Итого</span>
                  <span className="font-bold text-gray-900">{order.total} ₽</span>
                </div>

                {/* Адрес */}
                {order.deliveryAddress && (
                  <p className="text-gray-400 text-xs mt-2">
                    📍 {order.deliveryAddress}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;