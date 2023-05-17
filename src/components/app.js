import { h } from "preact";

import RosVelocityControl from './RosVelocityControl/RosVelocityControl';

import { MantineProvider, } from '@mantine/core';

const App = () => {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark" }}>
      <RosVelocityControl />
    </MantineProvider>
  );
};

export default App;
