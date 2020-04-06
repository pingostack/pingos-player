import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Card, Modal } from "antd";
import styles from "./index.less";
import Hls from "hls.js";

export default () => {
  const videoRef = useRef();
  const playerRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState("https://live.pingos.io:4443/hls/ice.m3u8");

  useEffect(() => {
    if (!Hls.isSupported()) {
      Modal.error({
        title: "错误提醒",
        content: "当前浏览器不支持，请换另一种播放器"
      });
    }

    return () => {
      // 清理
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const play = () => {
    setPlaying(true);
    const hls = new Hls();
    playerRef.current = hls;
    hls.attachMedia(videoRef.current);
    hls.loadSource(url);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      videoRef.current.play();
    });
  };

  const stop = () => {
    setPlaying(false);
    playerRef.current.destroy();
  };

  return (
    <div className={styles.container}>
      <Card title="HLS流直播">
        <div className={styles.box}>
          <Input
            onChange={e => {
              setUrl(e.target.value);
            }}
            value={url}
            className={styles.input}
          />

          {playing ? (
            <Button type="primary" onClick={stop}>
              停止
            </Button>
          ) : (
            <Button type="primary" onClick={play}>
              播放
            </Button>
          )}
        </div>

        <div className={styles["video-box"]}>
          <video ref={videoRef} className={styles.video}></video>
          <div className={styles.info}></div>
        </div>
      </Card>
    </div>
  );
};
