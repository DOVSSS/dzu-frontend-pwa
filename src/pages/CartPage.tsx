import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState(user?.address ?? '');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async () => {
    if (!address.trim()) {
      setError('Укажите адрес доставки');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await createOrder({
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
          productName: i.product.name,
          productImage: i.product.image,
        })),
        deliveryAddress: address,
        comment: comment || undefined,
      });
      clearCart();
      navigate('/orders');
    } catch {
      setError('Ошибка при оформлении заказа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
          >
            ← Назад
          </button>
          <h1 className="text-lg font-bold text-gray-900">Корзина</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-900">Корзина пуста</h2>
            <p className="text-gray-500 mt-2">Добавьте блюда из меню ресторана</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              Перейти к ресторанам
            </button>
          </div>
        ) : (
          <>
            {/* Список товаров */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-orange-500 font-bold mt-1">
                      {item.product.price * item.quantity} ₽
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Адрес доставки */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес доставки
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Улица, дом, квартира"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Комментарий */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Комментарий (необязательно)
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Пожелания к заказу"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Итого и кнопка */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Итого:</span>
                <span className="text-xl font-bold text-gray-900">{totalPrice} ₽</span>
              </div>
              <button
                onClick={handleOrder}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {isLoading ? 'Оформляем...' : 'Оформить заказ'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CartPage;