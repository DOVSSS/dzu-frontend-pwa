import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { type RestaurantWithProducts } from '../types/api.types';
import { getImageUrl } from '../utils/imageUrl';

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, items, totalItems } = useCart();

  const [restaurant, setRestaurant] = useState<RestaurantWithProducts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await api.get(`/restaurants/${id}`);
        setRestaurant(response.data);
      } catch {
        setError('Не удалось загрузить меню');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const getQuantity = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    return item?.quantity ?? 0;
  };

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
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">

        {isLoading && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl h-48 animate-pulse" />
            <div className="bg-white rounded-2xl h-24 animate-pulse" />
            <div className="bg-white rounded-2xl h-24 animate-pulse" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {!isLoading && restaurant && (
          <>
            {/* Обложка ресторана */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
              <img
                src={getImageUrl(restaurant.image)}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {restaurant.products?.length ?? 0} блюд в меню
                </p>
              </div>
            </div>

            {/* Меню */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Меню</h2>
            <div className="space-y-3">
              {restaurant.products?.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center"
                >
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-orange-500 font-bold mt-2">
                      {product.price} ₽
                    </p>
                  </div>

                  {getQuantity(product.id) === 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    >
                      +
                    </button>
                  ) : (
                    <div className="flex-shrink-0 flex items-center gap-2 bg-orange-50 rounded-xl px-2 py-1">
                      <button
                        onClick={() => updateQuantity(product.id, getQuantity(product.id) - 1)}
                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors font-bold"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-semibold text-gray-900">
                        {getQuantity(product.id)}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, getQuantity(product.id) + 1)}
                        className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default RestaurantPage;