import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Card, Modal } from "antd";
import styles from "./index.less";
import JSMpeg from "jsmpeg-player";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import FullScreen from "react-full-screen";

export default () => {
  const videoRef = useRef();
  const playerRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState("https://live.pingos.io:4443/ts/ice");
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    return () => {
      // 清理
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const play = () => {
    setPlaying(true);
    const ts = new JSMpeg.VideoElement(videoRef.current, url);
    ts.play();
    playerRef.current = ts;
  };

  const stop = () => {
    setPlaying(false);
    playerRef.current.destroy();
  };

  return (
    <div className={styles.container}>
      <Card title="TS流直播">
        <div className={styles["input-box"]}>
          <Input
            onChange={(e) => {
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

        <div className={styles["player-box"]}>
          <div className={styles.box}>
            <FullScreen
              enabled={fullScreen}
              onChange={(e) => {
                setFullScreen(e);
              }}
            >
              <div className={styles.player}>
                <video ref={videoRef} className={styles.video}></video>
                <div className={styles.control}>
                  {fullScreen ? (
                    <FullscreenExitOutlined
                      onClick={() => {
                        setFullScreen(false);
                      }}
                      className={styles.icon}
                    />
                  ) : (
                    <FullscreenOutlined
                      onClick={() => {
                        setFullScreen(true);
                      }}
                      className={styles.icon}
                    />
                  )}
                </div>
              </div>
            </FullScreen>
          </div>

          <div className={styles.info}></div>
        </div>
      </Card>
    </div>
  );
};
