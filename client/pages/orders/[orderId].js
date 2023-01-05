import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setMinutesLeft(Math.floor(msLeft / 1000 / 60));

      const minutes = msLeft / 1000 / 60;
      setSecondsLeft(Math.floor((minutes - Math.floor(minutes)) * 60));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (new Date(order.expiresAt) - new Date() < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {minutesLeft}:{secondsLeft}
      <StripeCheckout
        token={(token) => console.log(token)}
        stripeKey="pk_test_51MLgULFgKTyI8x6XlyaGZEF9nbjeRsVbRyGuhHKudPnyq9B00q4NZ7HoS51ca6jBOpSfHqTHiXDQQmEw19CyguGZ00HtBsauAP"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
