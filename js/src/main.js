import "babel-polyfill";
import './libs/polyfills';

import contentLoaded from 'content-loaded';
import MobileDetect from 'mobile-detect';

import {randomString} from './libs/StringUtils';
//import CanvasVideoPlayer from './libs/canvas-video-player';
import canvid from './libs/canvid';
//import VideoScroller from 'video-scroller';
import Headhesive from 'headhesive';
import {getElementSizes, getProportionSizes} from './libs/proportionElementResizes';
import viewportUnits from './libs/viewportUnits';

import {Sections} from './Sections.js';
//import scopeSelector from './libs/scopeSelector';

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile() ? true : false;

const imageExt = (window.Modernizr && window.Modernizr.webp.valueOf()) ? 'webp' : 'jpg';

const application = {
    start() {
        console.log('start App', new Date());
        console.log('current browser is', isMobile ? 'mobile' : 'desktop');

        let sections = this.sections = new Sections('.omp-page_content', document, {sectionSelector: '.omp-page'}, {
            '.omp-page-1_5-video': {
                videoByDimensions: {
                    "video":{
                        "portrait": {
                            "1920": {src: '/media/Jollac_camera1_hb.mp4', width: 1920, height: 1080},
                            "1280": {src: '/media/Jollac_camera1_hb_HD.mp4', width: 1280, height: 720},
                            "720": {src: '/media/Jollac_camera1_hb_portrait_hd.mp4', width: 720, height: 1234},
                            "*": {src: '/media/Jollac_camera1_hb_portrait_960.mp4', width: 540, height: 926},
                        },
                        "landscape": {
                            "1920": {src: '/media/Jollac_camera1_hb.mp4', width: 1920, height: 1080},
                            "1280": {src: '/media/Jollac_camera1_hb_HD.mp4', width: 1280, height: 720},
                            "*": {src: '/media/Jollac_camera1_hb_960.mp4', width: 960, height: 540},
                        },
                    },
                    "canvid": {
                        "portrait": {
                            "1920": {src: `/media/Jollac_camera1_hb.${imageExt}`, width: 1920, height: 1080, frames: 32, cols: 6, loops: 0, fps: 30},
                            "1280": {src: `/media/Jollac_camera1_hb_HD.${imageExt}`, width: 1280, height: 720, frames: 32, cols: 6, loops: 0, fps: 30},
                            "720": {src: `/media/Jollac_camera1_hb_portrait_hd.${imageExt}`, width: 720, height: 1234, frames: 32, cols: 6, loops: 0, fps: 30},
                            "*": {src: `/media/Jollac_camera1_hb_portrait_960.${imageExt}`, width: 540, height: 926, frames: 32, cols: 6, loops: 0, fps: 30},
                        },
                        "landscape": {
                            "1920": {src: `/media/Jollac_camera1_hb.${imageExt}`, width: 1920, height: 1080, frames: 32, cols: 6, loops: 0, fps: 30},
                            "1280": {src: `/media/Jollac_camera1_hb_HD.${imageExt}`, width: 1280, height: 720, frames: 32, cols: 6, loops: 0, fps: 30},
                            "*": {src: `/media/Jollac_camera1_hb_960.${imageExt}`, width: 960, height: 540, frames: 32, cols: 6, loops: 0, fps: 30},
                        },
                    },
                },
                _getContainer(type = this.__currentType) {
                    if ( type === 'video' ) {
                        return this._videoEl;
                    }
                    if ( type === 'canvas' ) {
                        return this._canvasEl;
                    }
                    return this._containerEl;
                },
                _setVideoSource(type = this.__currentType, videoDescription = {}) {
                    let containerEl = this._getContainer();

                    if ( type === 'video' ) {
                        // containerEl.src = videoDescription.src;
                        //
                        // if ( !containerEl.__videoScroller ) {
                        //     containerEl.__videoScroller = new VideoScroller({el: containerEl, invert: true});
                        // }
                    }
                    else if ( type == 'canvas') {

                    }
                    else if ( type == 'canvid') {
                        this.__canvidSrc = videoDescription;
                    }
                },
                _onCanvidFrame() {
                    let currentFrame = this.__canvidControl.getCurrentFrame();

                    if ( this.__canvidControl.isReverseNow ) {
                        if ( currentFrame <= this.__canvisNextStopFrame ) {
                            this.__canvidControl.pause();
                        }
                    }
                    else {
                        if ( currentFrame >= this.__canvisNextStopFrame ) {
                            this.__canvidControl.pause();
                        }
                    }

                    this.__canvidControl.__lastFrame = currentFrame;
                },
                _setPosition(position, inPercent, type = this.__currentType) {
                    let containerEl = this._getContainer();

                    if ( type === 'video' ) {
                        if ( !containerEl.src ) {
                            containerEl.currentTime = 0;
                            return;
                        }
                    }
                    else if ( type === 'canvas' ) {
                        if ( inPercent ) {
                            //containerEl.currentTime = containerEl.duration * (position / 100);
                        }
                    }
                    else if ( type === 'canvid' ) {
                        let {frames} = this.__canvidSrc;
                        if ( inPercent ) {
                            if ( position < 0 ) {
                                position = 0;
                            }
                            if ( position > 100 ) {
                                position = 100;
                            }
                            frames = frames - 1;
                            let nextFrame = Math.round(frames * (position / 100));
                            if ( nextFrame > frames ) {
                                nextFrame = frames;
                            }
                            else if ( nextFrame < 0 ) {
                                nextFrame = 0;
                            }

                            let currentFrame = this.__canvidControl.getCurrentFrame
                                ? this.__canvidControl.getCurrentFrame()
                                : null
                            ;
                            if ( currentFrame != nextFrame ) {
                                this.__canvisNextStopFrame = nextFrame;

                                let isRevers = currentFrame != null && nextFrame < currentFrame;
                                if ( !this.__canvidControl.isPlaying || !this.__canvidControl.isPlaying() ) {
                                    if ( this.__canvidControl.play ) {
                                        this.__canvidControl.play('clip1', isRevers, null, this.__canvidControl.__lastFrame);
                                    }
                                }
                            }
                        }
                    }

                },
                _getSizes(type = this.__currentType) {
                    let videoByDimensions = this.videoByDimensions[type][this._isPortrait ? "portrait" : "landscape"];
                    let videoDescription = videoByDimensions["*"];

                    for ( let dimensionKey of Object.keys(videoByDimensions) ) {
                        if ( dimensionKey !== "*" ) {
                            if ( this._screenWidth >= dimensionKey ) {
                                videoDescription = videoByDimensions[dimensionKey];
                            }
                        }
                    }

                    if ( type === 'canvid' ) {
                        if ( !videoDescription.onFrame ) {
                            videoDescription.onFrame = () => {
                                this._onCanvidFrame.call(this);
                            };
                        }
                    }

                    return videoDescription;
                },
                _setContainerPositions(type = this.__currentType) {
                    let containerEl = this._getContainer();
                    let needToRedraw = false;

                    if ( type === 'canvid' ) {
                        let {width, height} = this._getSizes();

                        if ( width != containerEl.width || height != containerEl.height ) {
                            containerEl.width = width;
                            containerEl.height = height;

                            needToRedraw = true;
                        }
                    }

                    let {width, height, left, right, top, bottom} = getProportionSizes({width: this._screenWidth, height: this._screenHeight}, this._getSizes());

                    containerEl.style.width = width + 'px';
                    containerEl.style.height = height + 'px';
                    containerEl.style.left = left + 'px';
                    containerEl.style.right = right + 'px';
                    // if ( top < 0 && bottom < 0 ) {
                    //     bottom = bottom / 2;
                    //     top = top +  bottom;
                    // }
                    containerEl.style.top = top + 'px';
                    containerEl.style.bottom = bottom + 'px';

                    return needToRedraw;

                },
                _isSameVideo(videoDescription, type = this.__currentType) {
                    if ( type === 'canvid' ) {
                        if ( this.__canvidControl && this.__canvidControl.getOpts ) {
                            let {videos} = this.__canvidControl.getOpts();

                            if ( videos ) {
                                let defaultClip = videos["clip1"];

                                return defaultClip && (defaultClip.src == videoDescription.src);
                            }
                        }
                    }

                    return false;
                },
                _initVideo() {
                    if ( this.__videoInited ) {
                        return;
                    }

                    this.__videoInited = true;

                    let {width, height, isPortrait} = getElementSizes(window, true);
                    this._screenWidth = width;
                    this._screenHeight = height;
                    this._isPortrait = isPortrait;

                    // console.log('screen', 'height:', this._screenHeight, ', width:', this._screenWidth, '|', this._isPortrait ? "portrait" : "landscape");

                    let {el} = this;
                    let videoEl = this._videoEl = el.querySelector('video');
                    if ( !videoEl.id ) {
                        videoEl.id = randomString('CanvasVideoPlayer_', '_video');
                    }
                    let canvasEl = this._canvasEl = el.querySelector('canvas');
                    if ( !canvasEl.id ) {
                        canvasEl.id = randomString('CanvasVideoPlayer_', '_canvas');
                    }
                    let containerEl = this._containerEl = el.querySelector('.omp-page-1_5-video__container');
                    if ( !containerEl.id ) {
                        containerEl.id = randomString('CanvasVideoPlayer_', '_container');
                    }

                    let type = 'canvid';//'video','canvas'
                    this.__currentType = type;

                    if ( type !== 'video' ) {
                        videoEl.style.display = 'none';
                    }
                    if ( type !== 'canvas' ) {
                        canvasEl.style.display = 'none';
                    }
                    if ( type !== 'canvid' ) {
                        containerEl.style.display = 'none';
                    }

                    canvasEl.classList.add('fullSize');
                    videoEl.classList.add('fullSize');
                    containerEl.classList.add('fullSize');

                    let needToRedraw = this._setContainerPositions();
                    let videoDescription = this._getSizes(type);

                    this._setVideoSource(type, videoDescription);

                    //console.log('Video URL', videoDescription.src, '|', this._isPortrait ? "portrait" : "landscape");

                    if ( type === 'canvid' ) {
                        if ( this.__canvidControl && !this._isSameVideo(videoDescription) ) {
                            this.__canvidControl.destroy();
                            this.__canvidControl = void 0;
                        }
                        if ( !this.__canvidControl ) {
                            let canvidControl = this.__canvidControl = canvid({
                                selector : '#' + this._getContainer(type).id,
                                videos: {
                                    clip1: videoDescription,
                                },
                                width: videoDescription.width,
                                height: videoDescription.height,
                                loaded: () => {
                                    let currentFrame = 0;
                                    let nextFrame = this.__canvisNextStopFrame;
                                    let isRevers = nextFrame != null && nextFrame < currentFrame;
                                    canvidControl.play('clip1', isRevers, null, canvidControl.__lastFrame);
                                    if ( nextFrame == null ) {
                                        canvidControl.pause();
                                    }

                                    this.el.classList.add('inited');// Section inited
                                },
                            });

                            //window.canvidControl = this.__canvidControl;
                        }
                        else if ( needToRedraw ) {
                            if ( this.__canvidControl.reDraw ) {
                                this.__canvidControl.reDraw();
                            }
                        }
                    }



                    // videoEl.src = src;
                    // canvasEl.width = width;
                    // canvasEl.height = height;
                    //
                    // if ( !this._canvasVideoPlayer || this._canvasVideoPlayer.__src != src ) {
                    //     if ( this._canvasVideoPlayer ) {
                    //         this._canvasVideoPlayer.unbind();
                    //     }
                    //     this._canvasVideoPlayer = new CanvasVideoPlayer({
                    //         videoSelector: '#' + videoEl.id,
                    //         canvasSelector: '#' + canvasEl.id,
                    //         //framesPerSecond: 25,
                    //         hideVideo: true, // should script hide the video element
                    //         autoplay: false,
                    //         // IMPORTANT On iOS can't be used together with autoplay, autoplay will be disabled
                    //         audio: false, // can be true/false (it will use video file for audio), or selector for a separate audio file
                    //         resetOnLastFrame: false, // should video reset back to the first frame after it finishes playing
                    //         loop: false,
                    //     });
                    // }
                },
                _playVideo(scrollTop = this._scrollTop) {
                    if ( this.__currentType !== 'canvid' && this.__videoInited /*&& this._canvasVideoPlayer*/ ) {
                        // console.log('jumpTo 2:', this.currentPercentTop, this.__currentType);
                        this._setPosition(this.currentPercentTop, true, this.__currentType);
                    }
                    if ( this.__currentType == 'canvid' ) {
                        // scrollTop = scrollTop + (window.AA || 0);
                        let {offsetHeight, offsetTop} = this.el;
                        // offsetTop = offsetTop + (window.BB || 0);
                        // if(window.AA)debugger;
                        let percent = (-20) + 100 - (((offsetHeight - (scrollTop - offsetTop)) / 1.5) * 100) / offsetHeight;

                        // console.log('jumpTo 1:', percent);
                        this._setPosition(percent, true, this.__currentType);
                    }
                },
                onCreate() {
                    this._initVideo();

                    this.__onScroll = this.__onScroll.bind(this);
                    this.__onResize = this.__onResize.bind(this);
                    window.addEventListener('scroll', this.__onScroll);
                    window.addEventListener('resize', this.__onResize);
                },
                onActive(isActive) {
                    this._isActive = isActive;
                    if ( isActive ) {
                        this._initVideo();
                    }
                    // console.log(this.el.classList, 'is', isActive ? 'active' : 'inactive', '!!!');
                },
                __onScroll() {
                    let scrollTop = this._scrollTop = sections.getScrollTop();
                    this._playVideo(scrollTop);
                },
                __onResize() {
                    this.__videoInited = false;

                    this._initVideo();
                },
            },
            // ".omp-page-2": {
            //     onCreate() {
            //         this.__onScroll = this.__onScroll.bind(this);
            //         window.addEventListener('scroll', this.__onScroll);
            //
            //         this._maxValue = parseInt(getComputedStyle(thi.el).top, 10);
            //         this._step = this._maxValue / 20;
            //         this._time = 1500;
            //     },
            //     __onScroll() {
            //
            //     },
            //     _move() {
            //         var time = this._time;
            //         var step = this._step;
            //
            //         var cur = parseInt(getComputedStyle(this.el).top, 10);
            //
            //         var doAnimateMove = (cur, start, alpha) => {
            //             clearTimeout(this.scrollTimer);
            //
            //             cur += step;
            //
            //             if(cur < time) {
            //                 this.scrollTimer = setTimeout(doAnimateMove.bind(null, cur, start, alpha), step);
            //             }
            //
            //             this.el.style = '-' +
            //
            //             window.scrollTo(window.pageXOffset, start + alpha * lineanBezier.get(cur / time).y);
            //             //parallaxScroll(); // Callback is required for iOS
            //             //redrawDotNav();
            //         };
            //
            //         doAnimateMove(
            //             0,
            //             window.pageYOffset,
            //             referedSection.offsetTop - window.pageYOffset
            //         );
            //     }
            // }
        });
        //window.sections = this.sections;

        // this.pager = new Dragend(document.querySelector("main"), {
        //     pageClass: "omp-page",
        //     direction: "vertical",
        //     onScrollingStart: (...args) => {
        //         this._onScrollingStart(...args);
        //     },
        //     onScrollingEnd: (...args) => {
        //         this._onScrollingEnd(...args);
        //     },
        // });
        //
        // addWheelListener(document, (event) => {
        //     this.onMouseWheel(event);
        // });
        // document.addEventListener('keyup', (event) => {
        //     this.onKeyUp(event);
        // });

        var header = new Headhesive('#main_page_header', {offset: 200});
        let mainPageElement = document.getElementById('main_page_element');
        main_page_element.appendChild(header.clonedElem);

        let logoEl = header.clonedElem.querySelector('.omp-page_header__logo');
        logoEl.parentElement.removeChild(logoEl);

    },

    _onScrollingStart(containerElement, activeElement) {
        activeElement.classList.remove('active');
        this._paused = true;
        // console.log(' <<< _onScrollingStart');
    },

    _onScrollingEnd(containerElement, activeElement) {
        activeElement.classList.add('active');
        this._paused = false;
        // console.log(' >>> _onScrollingEnd');
    },

    // /**
    //  * @param {number} pageNum - from 1 to N. Special: 0 - also First page, -1 - Last page
    //  */
    // goToPage(pageNum) {
    //     if ( !pageNum && pageNum !== 0 ) {
    //         return;
    //     }
    //
    //     // special cases
    //     if ( pageNum === 0 ) {
    //         pageNum = 1;
    //     }
    //     if ( pageNum === -1 ) {
    //         pageNum = this.pager.pagesCount;
    //     }
    //
    //     if ( pageNum > 0 && pageNum <= this.pager.pagesCount ) {
    //         this.pager.scrollToPage(pageNum);
    //     }
    // },
    //
    // /**
    //  * @param {boolean} direction - true = next page, false = prev page
    //  */
    // goToNextPage(direction) {
    //     let nextPage = (this.pager.page + 1) + (direction ? 1 : -1);
    //
    //     this.goToPage(nextPage);
    // },
    //
    // onMouseWheel(event) {
    //     if ( this._paused ) {
    //         return;
    //     }
    //
    //     let {deltaY} = event;
    //
    //     if ( !deltaY ) {
    //         return;
    //     }
    //
    //     this.goToNextPage(deltaY > 0);
    // },
    //
    // onKeyUp({keyCode}) {
    //     switch (keyCode) {
    //         case 32://Space
    //         case 34://ArrowDown
    //         case 40://PageDown
    //             this.goToNextPage(true);
    //             break;
    //         case 33://PageUp
    //         case 38://ArrowUp
    //             this.goToNextPage(false);
    //             break;
    //         case 36://Home
    //             this.goToPage(0);
    //             break;
    //         case 35://End
    //             this.goToPage(-1);
    //             break;
    //     }
    // }
};

contentLoaded().then(function() {
    let cache = {};
    let defaultEl = {style: {}};
    function find(selector) {
        let el = cache[selector];
        if ( !el ) {
            el = cache[selector] = document.querySelector(selector);
        }
        return el || defaultEl;
    }
    function findAll(selector) {
        let el = cache[selector];
        if ( !el ) {
            el = cache[selector] = document.querySelectorAll(selector);
        }
        return el || defaultEl;
    }

    /*
    ВНИМАНИЕ !!!!!!!!!!!!!!!!
    Этот код нужно поддерживать в актуальном состоянии из значений из файла css/index.css ВРУЧНУЮ !!!
    */
    function emulateViewportUnits() {
        let vmaxOnly = viewportUnits.isSupported() && !viewportUnits.isSupportedVmax();

        if ( viewportUnits.isScreenPortrait() ) {
            find('main').style.fontSize = viewportUnits.calc('2.5vmax', true);

            if ( vmaxOnly ) {
                return;
            }
        }
        else {
            if ( vmaxOnly ) {
                find('main').style.fontSize = '';

                return;
            }

            find('main').style.fontSize = viewportUnits.calc('2.5vmin', true);
        }

        if ( vmaxOnly ) {
            return;
        }

        for ( let el of findAll('.omp-page') ) {
            if ( !el.classList.contains('.omp-page-5') ) {
                el.style.minHeight = viewportUnits.calc('100vh', true);
            }
        }

        find('.omp-page-1').style.minHeight = viewportUnits.calc('180vh', true);

        for ( let el of findAll('.omp-page-3__imgs') ) {
            el.style.top = viewportUnits.calc('8vh', true);
        }
    }

    if ( !viewportUnits.isSupported() || !viewportUnits.isSupportedVmax() ) {
        emulateViewportUnits();

        setTimeout(emulateViewportUnits, 500);

        window.addEventListener('resize', emulateViewportUnits);
        window.addEventListener('orientationchange', emulateViewportUnits);
    }


    application.start();
});

/*
resources:
 Online CSS Gradient Generator: http://angrytools.com/gradient/
 http://fonts4web.ru/
 http://noeldelgado.github.io/gemini-scrollbar/
 https://github.com/jquery/jquery-mousewheel/blob/master/jquery.mousewheel.js
 CSS3 Media Query Boilerplate: https://gist.github.com/andybriggs/2730949
 CSS3 Media Queries template: https://gist.github.com/marcobarbosa/798569
*/