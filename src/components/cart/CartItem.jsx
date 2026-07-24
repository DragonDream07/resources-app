import React from 'react';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const {
    id,
    imageUrl,
    name,
    sku,
    variantLabel,
    quantity,
    unitPrice,
    totalPrice,
  } = item;

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleRemove = () => {
    onRemove(id);
  };

  return (
    <div className="cart-item">
      <div className="cart-item__image-wrapper">
        <img
          src={imageUrl || placeholderProduct}
          alt={name}
          className="cart-item__image"
          onError={(e) => { e.currentTarget.src = placeholderProduct; }}
        />
      </div>

      <div className="cart-item__details">
        <p className="cart-item__name">{name}</p>
        {sku && <p className="cart-item__sku">SKU: {sku}</p>}
        {variantLabel && <p className="cart-item__variant">{variantLabel}</p>}
      </div>

      <div className="cart-item__qty-stepper">
        <button
          className="cart-item__qty-btn"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <img src={minusIcon} alt="Decrease" width={16} height={16} />
        </button>
        <span className="cart-item__qty-value">{quantity}</span>
        <button
          className="cart-item__qty-btn"
          onClick={handleIncrement}
          aria-label="Increase quantity"
        >
          <img src={plusIcon} alt="Increase" width={16} height={16} />
        </button>
      </div>

      <div className="cart-item__pricing">
        <p className="cart-item__unit-price">₹{unitPrice.toFixed(2)}</p>
        <p className="cart-item__total-price">₹{totalPrice.toFixed(2)}</p>
      </div>

      <button
        className="cart-item__remove-btn"
        onClick={handleRemove}
        aria-label="Remove item"
      >
        <img src={trashIcon} alt="Remove" width={18} height={18} />
      </button>
    </div>
  );
};

export default CartItem;
