const HomePage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

HomePage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default HomePage;
