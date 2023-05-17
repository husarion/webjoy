import { h } from 'preact';
import ROSLIB from "roslib";

import { useState, useEffect, useRef } from 'preact/hooks';
import { Flex, useMantineTheme, Kbd, Notification } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { Joystick } from 'react-joystick-component';


const RosVelocityControl = () => {
  const velRef = useRef([0.0, 0.0]);
  const [velocity, setVelocity] = useState([0.0, 0.0]); 
  const [ros, setRos] = useState(null);
  const [cmdVelTopic, setCmdVelTopic] = useState(null);
  const [publishInterval, setPublishInterval] = useState(null);

  const { ref, width, height } = useElementSize();
  const theme = useMantineTheme();

  const noSelectStyle = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MsUserSelect: 'none'
  };

  const publishVelocity = () => {
    if (!cmdVelTopic) {
      console.log("no cmdVelTopic");
      return; // cmdVelTopic is null, exit the function
    }

    let [linearVel, angularVel] = velRef.current;

    const twist = new ROSLIB.Message({
      linear: {
        x: linearVel,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: angularVel,
      },
    });

    cmdVelTopic.publish(twist);
  }

  // ====================================
  // ROS 2 setup
  // ====================================

  useEffect(() => {
    console.log(`process.env.NODE_ENV: ${ process.env.NODE_ENV }`);

    let rosBridgeHost = `{{env "ROSBRIDGE_SERVER_HOST"}}`;
    console.log(`ROSBRIDGE_SERVER_HOST=${rosBridgeHost}`);
    console.log(`HOST={{.Host}}`);

    let url = `ws://{{.Host}}:9090`;

    // if (rosBridgeHost !== "") {
    //   url = `ws://${rosBridgeHost}:9090`;
    // }

    console.log(`url=${url}`);

    const newRos = new ROSLIB.Ros({ url });
    setRos(newRos);

    const newCmdVelTopic = new ROSLIB.Topic({
      ros: newRos,
      name: "/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });
    setCmdVelTopic(newCmdVelTopic);

    return () => {
      if (ros) {
        ros.close();
      }
    }

  }, []);


  useEffect(() => {
    if (cmdVelTopic) {
      const interval = setInterval(() => {
        publishVelocity();
      }, 100);

      setPublishInterval(interval);

      return () => {
        if (publishInterval) {
          clearInterval(publishInterval);
        }
      }
    }
  }, [cmdVelTopic]);

  // ====================================
  // Keyboard events
  // ====================================

  useEffect(() => {
    const handleKeyDown = (e) => {
      let [linearVel, angularVel] = velRef.current;
      switch (e.key) {
        case "w":
          linearVel = 1;
          break;
        case "s":
          linearVel = -1;
          break;
        case "a":
          angularVel = 1;
          break;
        case "d":
          angularVel = -1;
          break;
      }
      velRef.current = [linearVel, angularVel];
      setVelocity([linearVel, angularVel]);
      publishVelocity();
    }

    const handleKeyUp = (e) => {
      let [linearVel, angularVel] = velRef.current;
      switch (e.key) {
        case "w":
          linearVel = 0;
          break;
        case "s":
          linearVel = 0;
          break;
        case "a":
          angularVel = 0;
          break;
        case "d":
          angularVel = 0;
          break;
      }
      velRef.current = [linearVel, angularVel];
      setVelocity([linearVel, angularVel]);
      publishVelocity();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }

  }, [cmdVelTopic]);

  // ====================================
  // Joystick events
  // ====================================

  const handleMove = (event) => {
    console.log(event.direction);
    const linearVel = event.y;
    const angularVel = - event.x;
    velRef.current = [linearVel, angularVel];
    publishVelocity()
  }

  const handleStop = (event) => {
    console.log(event);
    velRef.current = [0, 0];
    publishVelocity()
  }

  return (
    <Flex
      ref={ref}
      justify="center"
      align="center"
      direction="column"
      gap="lg"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Notification style={noSelectStyle} title="Keyboard control" color="red" radius="lg" withCloseButton={false}>
        <br />
        <Kbd>&nbsp;</Kbd><Kbd>w</Kbd><Kbd>&nbsp;</Kbd>
        <br />
        <Kbd>a</Kbd><Kbd>s</Kbd><Kbd>d</Kbd> 
        <br />
      </Notification>
      <Joystick
        size={width}
        sticky={false}
        baseShape="square"
        stickShape="square"
        baseColor={theme.colors.gray[9]}
        stickColor={theme.colors.red[9]}
        move={handleMove}
        stop={handleStop}
        pos={{ x: -velocity[1], y: velocity[0] }}
      />
    </Flex>
  );
};

export default RosVelocityControl;
