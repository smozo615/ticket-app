import { useEffect } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      return Router.push('/');
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>signing you out...</div>;
};

export default Signout;
