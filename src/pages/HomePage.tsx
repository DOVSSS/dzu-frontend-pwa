import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getRestaurants } from '../services/restaurantService';
import {type Restaurant } from '../types/api.types';
import { getImageUrl } from '../utils/imageUrl';
const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleShare = async () => {
  const shareData = {
    title: 'DZU — Доставка еды',
    text: 'Заказывай вкусную еду с доставкой через DZU!',
    url: window.location.origin,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // пользователь закрыл диалог — ничего не делаем
    }
  } else {
    await navigator.clipboard.writeText(shareData.url);
    alert('Ссылка скопирована в буфер обмена!');
  }
};

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch {
        setError('Не удалось загрузить рестораны');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">DZU</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="text-gray-600 text-sm font-medium hover:text-orange-500 transition-colors"
            >
              Заказы
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="relative bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              🛒 Корзина
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
  onClick={handleShare}
  className="text-gray-600 text-sm font-medium hover:text-orange-500 transition-colors"
>
  📤 Поделиться
</button>
            <button
              onClick={logout}
              className="text-gray-400 text-sm hover:text-red-500 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* Приветствие */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Привет, {user?.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">Что будем заказывать сегодня?</p>
        </div>

        {/* Рестораны */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Рестораны</h2>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-40 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <img
                 src={getImageUrl(restaurant.image)}
                  alt={restaurant.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {restaurant.products?.length ?? 0} блюд
                  </p>
                </div>
              </div>
            ))}

            {restaurants.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                Рестораны пока не добавлены
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;