import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Card } from "antd";
import styles from "./index.less";

export default () => {
  const videoRef = useRef();
  const hlsRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState(
    "https://meet-frame.inside.xiaoeknow.com/app5ace18276a3e6_9kJzSUh6/video/1/l_5ae13437e845a_eoKpS8BMdV.m3u8"
  );

  useEffect(() => {
    if (WXInlinePlayer.isSupport()) {
      WXInlinePlayer.init({
        asmUrl: "/prod.baseline.asm.combine.js",
        wasmUrl: "/prod.baseline.wasm.combine.js",
      });

      WXInlinePlayer.ready().then(() => {
        const player = new WXInlinePlayer({
          url: "https://static.petera.cn/mm.flv",
          $container: videoRef.current,
          hasVideo: true,
          hasAudio: true,
          volume: 1.0,
          muted: false,
          autoplay: true,
          loop: true,
          isLive: false,
          chunkSize: 128 * 1024,
          preloadTime: 5e2,
          bufferingTime: 1e3,
          cacheSegmentCount: 64,
          customLoader: null,
        });

        player.play();
      });
    }
    return () => {
      console.log("componentWillUnmount: 组件卸载， 做一些清理工作");
    };
  }, []);

  const play = () => {
    setPlaying(true);
    // const hls = new Hls();
    // hlsRef.current = hls;
    // hls.attachMedia(videoRef.current);
    // hls.loadSource(url);
    // hls.on(Hls.Events.MANIFEST_PARSED, function() {
    //   videoRef.current.play();
    // });
  };

  const stop = () => {
    setPlaying(false);
    // hlsRef.current.destroy();
  };

  return (
    <div className={styles.container}>
      <Card title="FLV流直播">
        <div className={styles.box}>
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

        <div className={styles["video-box"]}>
          <canvas ref={videoRef} className={styles.video}></canvas>
          <div className={styles.info}></div>
        </div>
      </Card>
    </div>
  );
};
