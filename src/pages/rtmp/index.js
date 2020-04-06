import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Card, Modal } from "antd";
import styles from "./index.less";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import FullScreen from "react-full-screen";

export default () => {
  const videoRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState("rtmp://live.pingos.io/live/ice");
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    // if (!Hls.isSupported()) {
    //   Modal.error({
    //     title: "错误提醒",
    //     content: "当前浏览器不支持，请换另一种播放器",
    //   });
    // }

    return () => {
      // 清理
    };
  }, []);

  const splitRTMP = (url) => {
    const index = url.lastIndexOf("/");
    return {
      server: url.slice(0, index + 1),
      domain: url.slice(index + 1),
    };
  };

  const play = () => {
    setPlaying(true);
    const { server, domain } = splitRTMP(url);
    videoRef.current.startLive(server, domain);
  };

  const stop = () => {
    setPlaying(false);
    videoRef.current.stop();
  };

  return (
    <div className={styles.container}>
      <Card title="RTMP流直播">
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
                <object
                  ref={videoRef}
                  className={styles.video}
                  type="application/x-shockwave-flash"
                  data={`${window.routerBase}/flash/index.swf`}
                  bgcolor="#000000"
                >
                  <param name="allowfullscreen" value="true" />
                  <param name="allowscriptaccess" value="always" />
                  <param name="wmode" value="opaque" />
                  <param name="menu" value="false" />
                </object>

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
