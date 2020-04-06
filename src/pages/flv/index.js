import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Card } from "antd";
import styles from "./index.less";

import WXInlinePlayer from "./components/p";

export default () => {
  const videoRef = useRef();
  const playerRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(720);
  const [url, setUrl] = useState("https://live.pingos.io:4443/flv/ice");

  useEffect(() => {
    if (WXInlinePlayer.isSupport()) {
      WXInlinePlayer.init({
        asmUrl: `${window.routerBase}WXInlinePlayer/prod.baseline.asm.combine.js`,
        wasmUrl: `${window.routerBase}WXInlinePlayer/prod.baseline.wasm.combine.js`
      });
    }

    return () => {
      console.log("componentWillUnmount: 组件卸载， 做一些清理工作");
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
    // playerRef.current.destroy();
    // playerRef.current = null;
  };

  return (
    <div className={styles.container}>
      <Card title="FLV流直播">
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
          <canvas
            width={width}
            height={height}
            ref={videoRef}
            className={styles.video}
          ></canvas>
          <div className={styles.info}></div>
        </div>
      </Card>
    </div>
  );
};
