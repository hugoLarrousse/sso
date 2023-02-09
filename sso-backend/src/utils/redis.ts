const formatConnectionString = (connectionString: string) => {
  try {
    if (!connectionString) {
      throw new Error('Redis: No connection string provided');
    }
    // internal redis for render
    if (connectionString.includes('redis://red-')) {
      const [, hostAndPort] = connectionString.split('redis://');

      const [host, port] = hostAndPort.split(':');
      return {
        username: undefined,
        password: undefined,
        host,
        port: Number(port),
      };
    }

    const [, username, passwordAndHost, port] = connectionString.split(':');

    return {
      username: username.split('//')[1],
      password: passwordAndHost.split('@')[0],
      host: passwordAndHost.split('@')[1],
      port: Number(port),
    };
  } catch (e) {
    throw new Error(`Invalid connection string: ${connectionString}`);
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  formatConnectionString,
};
