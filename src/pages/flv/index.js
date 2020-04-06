import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Card, Modal } from "antd";
import styles from "./index.less";
import WXInlinePlayer from "./components/p";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import FullScreen from "react-full-screen";

export default () => {
  const videoRef = useRef();
  const playerRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(720);
  const [url, setUrl] = useState("https://live.pingos.io:4443/flv/ice");
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (WXInlinePlayer.isSupport()) {
      WXInlinePlayer.init({
        asmUrl: `${window.routerBase}WXInlinePlayer/prod.baseline.asm.combine.js`,
        wasmUrl: `${window.routerBase}WXInlinePlayer/prod.baseline.wasm.combine.js`
      });
    } else {
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

    WXInlinePlayer.ready().then(() => {
      const player = new WXInlinePlayer({
        url,
        $container: videoRef.current,
        hasVideo: true,
        hasAudio: true,
        volume: 1.0,
        muted: false,
        autoplay: true,
        loop: true,
        isLive: true,
        chunkSize: 128 * 1024,
        preloadTime: 5e2,
        bufferingTime: 1e3,
        cacheSegmentCount: 64,
        customLoader: null
      });

      player.on("mediaInfo", mediaInfo => {
        const { onMetaData } = mediaInfo;
        let width;
        let height;

        height = onMetaData.height;
        width = onMetaData.width;
        for (let i = 0; i < onMetaData.length; i++) {
          if ("height" in onMetaData[i]) {
            height = onMetaData[i].height;
          } else if ("width" in onMetaData[i]) {
            width = onMetaData[i].width;
          }
        }

        if (width) {
          setWidth(width);
        }
        if (height) {
          setHeight(height);
        }
      });

      player.play();

      playerRef.current = player;
    });
  };

  const stop = () => {
    setPlaying(false);
    playerRef.current.stop();
  };

  return (
    <div className={styles.container}>
      <Card title="FLV流直播">
        <div className={styles["input-box"]}>
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

        <div className={styles["player-box"]}>
          <div className={styles.box}>
            <FullScreen
              enabled={fullScreen}
              onChange={e => {
                setFullScreen(e);
              }}
            >
              <div className={styles.player}>
                <canvas
                  width={width}
                  height={height}
                  ref={videoRef}
                  className={styles.video}
                ></canvas>

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
