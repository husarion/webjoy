## Demo

Execute in the robot / PC terminal:

```bash
docker compose -f compose.<chosen-config>.yaml pull
xhost +local:docker # if using gazebo
docker compose -f compose.<chosen-config>.yaml up
```

And visit the webjoy UI: `http://<robot-or-pc-IP:8080`


> **ROSbot 2R firmware**
>
> Install the proper firmware first:
>
> 
> 1. ROS 2 Humble
> 
> ```bash
> docker run --rm -it --privileged husarion/rosbot:humble /flash-firmware.py /root/firmware.bin
> ```
> 
> 2. ROS Noetic
> 
> ```bash
> docker run --rm -it --privileged husarion/rosbot:noetic /> flash-firmware.py /root/firmware_diff.bin
> ```