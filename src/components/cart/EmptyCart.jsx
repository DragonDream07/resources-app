import React from 'react';
import { Link } from 'react-router-dom';
import emptyStateImage from '@/assets/images/empty-state.svg';

const EmptyCart = () => {
  return (
    <div className="empty-cart">
      <div className="empty-cart__illustration">
        <img
          src={emptyStateImage}
          alt="Your cart is empty"
          className="empty-cart__image"
          width={240}
          height={240}
        />
      </div>
      <h2 className="empty-cart__title">Your cart is empty</h2>
      <p className="empty-cart__description">
        Looks like you haven't added anything yet. Start shopping to fill it up!
      </p>
      <Link to="/products" className="empty-cart__cta">
        Browse Products
      </Link>
    </div>
  );
};

export default EmptyCart;
