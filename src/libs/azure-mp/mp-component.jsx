import React, { Component } from 'react'
import loadLibrary from './load-library'
import classNames from 'classnames'
import './mp-component.css'
import { throttle } from 'lodash'

const DEFAULT_SKIN = 'amp-default'
const DEFAULT_RATIO = [16, 9]
const DEFAULT_INTERVAL = 1000

class AzureMP extends Component {
  constructor(props) {
    super(props)
    this.videoNode = React.createRef()
    this._ampEventHandler = this._ampEventHandler.bind(this)

    this.throttleProgress = throttle(() => {
      if (!this.isDestroyed) {
        this.props.onProgress?.({ playedSeconds: this.player.currentTime(), played: this.player.currentTime() / this.player.duration() })
      }
    }, props.progressInterval ?? DEFAULT_INTERVAL)
  }

  seekTo(played) {
    this.player?.currentTime(played * this.player.duration());
  }

  destroyPlayer() {
    this.isDestroyed = true
    this.player && this.player.dispose()
  }

  componentWillUnmount() {
    this.destroyPlayer()
  }

  componentDidMount() {
    const { skin } = this.props
    this.initialization = loadLibrary(skin).then(() => {
      this.createPlayer()
      this.setVideo()
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.initialization.then(() => this.setVideo())
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.playing != this.props.playing && this.player) {
      let toggle = nextProps.playing ? this.player.play() : this.player.pause()
    }

    if (nextProps.muted !== this.props.muted && this.player) {
      this.player.muted(nextProps.muted)
    }

    return nextProps !== this.props && nextProps.src[0].src !== this.props.src[0].src
  }

  setVideo() {
    const { src } = this.props
    this.player.src(src)
  }

  createPlayer() {
    const { options, onInstanceCreated } = this.props
    const defaultOptions = {
      controls: true,
      logo: { enabled: false },
      autoplay: this.props.playing ?? false,
      muted: this.props.muted ?? false
    }
    this.player = window.amp(
      this.videoNode.current,
      Object.assign({}, defaultOptions, options)
    )

    let amp = window.amp
    window.player = this.player
    this.player.addEventListener(amp.eventName.volumechange, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.ended, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.timeupdate, this._ampEventHandler);

    this.player.addEventListener(amp.eventName.pause, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.play, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.playing, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.seeking, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.seeked, this._ampEventHandler);

    this.player.addEventListener(amp.eventName.loadstart, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.loadedmetadata, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.loadeddata, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.fullscreenchange, this._ampEventHandler);

    this.player.addEventListener(amp.eventName.waiting, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.canplaythrough, this._ampEventHandler);
    this.player.addEventListener(amp.eventName.error, this._ampEventHandler);

    onInstanceCreated && onInstanceCreated(this.player)
  }

  _ampEventHandler(evt) {
    //console.log(evt.type, evt, this.player);
    switch (evt.type) {
      case window.amp.eventName.loadedmetadata:
        this.props.onReady?.()
        return;
      case window.amp.eventName.loadeddata:
        this.props.onDuration?.(this.player.duration())
        return;
      case window.amp.eventName.play:
        this.props.onPlay?.()
        return;
      case window.amp.eventName.pause:
        this.props.onPause?.()
        return;
      case window.amp.eventName.seeked:
        this.props.onSeek?.()
        return;
      case window.amp.eventName.ended:
        this.props.onEnded?.()
        return;
      case window.amp.eventName.timeupdate:
        this.throttleProgress()
        return;
    }
  }

  getRatioStyles(ratio) {
    if (!ratio) {
      return {}
    }
    return { paddingBottom: (ratio[1] / ratio[0]) * 100 + '%' }
  }

  render() {
    const {
      className,
      skin = DEFAULT_SKIN,
      adaptRatio = DEFAULT_RATIO,
      cornerPlayBtn
    } = this.props
    return (
      <div
        style={this.getRatioStyles(adaptRatio)}
        className={classNames(
          'azure-mp-container',
          className
        )}>
        <video
          ref={this.videoNode}
          className={classNames('azuremediaplayer', `${skin}-skin`, {
            'amp-big-play-centered': !cornerPlayBtn
          })}
        />
      </div>
    )
  }
}

export default AzureMP