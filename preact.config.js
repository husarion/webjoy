export default {
  webpack(config, env) {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      },
    };

    return config;
  },
};
