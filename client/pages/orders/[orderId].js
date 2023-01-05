import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

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
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51MLgULFgKTyI8x6XlyaGZEF9nbjeRsVbRyGuhHKudPnyq9B00q4NZ7HoS51ca6jBOpSfHqTHiXDQQmEw19CyguGZ00HtBsauAP"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
