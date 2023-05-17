## Demo

### ROSbot XL Gazebo Model

```
docker compose -f compose.rosbot.gazebo.humble.yaml pull
docker compose -f compose.rosbot.gazebo.humble.yaml build
xhost +local:docker
docker compose -f compose.rosbot.gazebo.humble.yaml up
```