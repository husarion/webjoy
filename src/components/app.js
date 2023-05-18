import { h } from "preact";

import RosVelocityControl from './RosVelocityControl/RosVelocityControl';

import { MantineProvider, Flex, AppShell, Header } from '@mantine/core';

const App = () => {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark" }}>
    <AppShell
      padding="md"
      header={
      <Header height={60} p="xs">
        <img src={require('../assets/husarion-logo.svg').default} alt="Logo" width={100} height={40} />
      </Header>
      }
    >
      <Flex
        justify="center"
        align="center"
        direction="column"
        gap="lg"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          maxWidth: '50%',
        }}
      >
        <RosVelocityControl />
      </Flex>
      </AppShell>
    </MantineProvider >
  );
};

export default App;
