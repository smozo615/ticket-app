import buildClient from '../api/build-client';

const HomePage = ({ currentUser }) => {
  return <h1>{currentUser.email}</h1>;
};

HomePage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/profile');

  return data;
};

export default HomePage;
