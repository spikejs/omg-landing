(function(root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.canvid = factory();
    }
}(this, function() {

    function canvid(params) {
        var defaultOptions = {
                width : 800,
                height : 450,
                selector: '.canvid-wrapper'
            },
            firstPlay = true,
            control = {
                play: function() {
                    console.log('Cannot play before images are loaded');
                }
            },
            _opts = merge(defaultOptions, params),
            el = typeof _opts.selector === 'string' ? document.querySelector(_opts.selector) : _opts.selector;

        if (!el) {
            return console.warn('Error. No element found for selector', _opts.selector);
        }

        if (!_opts.videos) {
            return console.warn('Error. You need to define at least one video object');
        }

        if (hasCanvas()) {

            loadImages(_opts.videos, function(err, images) {
                if (err) return console.warn('Error while loading video sources.', err);

                var ctx = initCanvas(),
                    requestAnimationFrame = reqAnimFrame();
                // ADDED BY TERMI: START
                var cancelAnimationFrame = canAnimFrame();
                // ADDED BY TERMI: END

                //control.play = function(key, reverse, fps) {
                // ADDED BY TERMI: START ", curFrame"
                control.play = function(key, reverse, fps, _curFrame) {
                // ADDED BY TERMI: END
                    if (control.pause) control.pause(); // pause current vid

                    var img = images[key],
                        opts = _opts.videos[key],
                        frameWidth = img.width / opts.cols,
                        frameHeight = img.height / Math.ceil(opts.frames / opts.cols);

                    var curFps = fps || opts.fps || 15,
                        curFrame = reverse ? opts.frames - 1 : 0,
                        wait = 0,
                        playing = true,
                        loops = 0,
                        delay = 60 / curFps;
                    // ADDED BY TERMI: START
                    control.isReverseNow = !!reverse;
                    if(_curFrame || _curFrame == 0){
                        curFrame = _curFrame;
                    }
                    // ADDED BY TERMI: END

                    requestAnimationFrame(frame);

                    control.resume = function() {
                        playing = true;
                        requestAnimationFrame(frame);
                    };

                    control.pause = function() {
                        // ADDED BY TERMI: START
                        // playing = false;
                        // requestAnimationFrame(frame);
                        if ( playing ) {
                            requestAnimationFrame(frame);
                        }
                        playing = false;
                        // ADDED BY TERMI: END
                    };

                    control.isPlaying = function() {
                        return playing;
                    };

                    // control.destroy = function(){
                    //     control.pause();
                    //     removeCanvid();
                    // };

                    control.getCurrentFrame = function(){
                        return curFrame;
                    };

                    control.setCurrentFrame = function(frameNumber){
                        if(frameNumber < 0 || frameNumber >= opts.frames){
                            return false;
                        }

                        if(!control.isPlaying()){
                            drawFrame(frameNumber);
                        }

                        curFrame = frameNumber;
                    };

                    // ADDED BY TERMI: START
                    control.getOpts = function() {
                        return _opts;
                    };

                    control.reDraw = function() {
                        drawFrame(curFrame);
                    };

                    control.destroy = function() {
                        cancelAnimationFrame();
                        playing = false;
                        curFrame = -1;
                        _opts = void 0;
                        ctx = void 0;
                    };
                    // ADDED BY TERMI: END

                    if (firstPlay) {
                        firstPlay = false;
                        hideChildren();
                    }

                    function frame() {
                        if (!wait) {
                            drawFrame(curFrame);
                            // ADDED BY TERMI: START
                            control.isReverseNow = !!reverse;
                            if(opts.onFrame && isFunction(opts.onFrame)){
                                opts.onFrame();
                            }
                            if(!playing) {
                                return;
                            }
                            // ADDED BY TERMI: END

                            curFrame = (+curFrame + (reverse ? -1 : 1));
                            if (curFrame < 0) curFrame += +opts.frames;
                            if (curFrame >= opts.frames) curFrame = 0;
                            if (reverse ? curFrame == opts.frames - 1 : !curFrame) loops++;
                            if (opts.loops && loops >= opts.loops){
                                playing = false;
                                if(opts.onEnd && isFunction(opts.onEnd)){
                                    opts.onEnd();
                                }
                            }
                        }
                        wait = (wait + 1) % delay;
                        if (playing && opts.frames > 1) requestAnimationFrame(frame);
                    }

                    function drawFrame(f) {
                        var fx = Math.floor(f % opts.cols) * frameWidth,
                            fy = Math.floor(f / opts.cols) * frameHeight;

                        ctx.clearRect(0, 0, _opts.width, _opts.height); // clear frame
                        ctx.drawImage(img, fx, fy, frameWidth, frameHeight, 0, 0, _opts.width, _opts.height);
                    }

                }; // end control.play

                if (isFunction(_opts.loaded)) {
                    _opts.loaded(control);
                }

            }); // end loadImages

        } else if (opts.srcGif) {
            var fallbackImage = new Image();
            fallbackImage.src = opts.srcGif;

            el.appendChild(fallbackImage);
        }

        function loadImages(imageList, callback) {
            var images = {},
                imagesToLoad = Object.keys(imageList).length;

            if(imagesToLoad === 0) {
                return callback('You need to define at least one video object.');
            }

            for (var key in imageList) {
                images[key] = new Image();
                images[key].onload = checkCallback;
                images[key].onerror = callback;
                images[key].src = imageList[key].src;
            }

            function checkCallback() {
                imagesToLoad--;
                if (imagesToLoad === 0) {
                    callback(null, images);
                }
            }
        }

        function initCanvas() {
            // ADDED BY TERMI: start
            if ( el.tagName == 'CANVAS' ) {
                el.width = _opts.width;
                el.height = _opts.height;
                el.classList.add('canvid');

                return el.getContext('2d');
            }
            // ADDED BY TERMI: end
            var canvas = document.createElement('canvas');
            canvas.width = _opts.width;
            canvas.height = _opts.height;
            canvas.classList.add('canvid');

            el.appendChild(canvas);

            return canvas.getContext('2d');
        }

        function hideChildren() {
            [].forEach.call(el.children, function(child){
                if(!child.classList.contains('canvid') ){
                    child.style.display = 'none';
                }
            });
        }

        function removeCanvid(){
            [].forEach.call(el.children, function(child){
                if(child.classList.contains('canvid') ){
                    el.removeChild(child);
                }
            });
        }

        // function reqAnimFrame() {
        //     return window.requestAnimationFrame
        //         || window.webkitRequestAnimationFrame
        //         || window.mozRequestAnimationFrame
        //         || window.msRequestAnimationFrame
        //         || function(callback) {
        //             return setTimeout(callback, 1000 / 60);
        //         };
        // }

        // ADDED BY TERMI: START
        var __requestID = void 0;

        function canAnimFrame() {
            var cancelAnimationFrame = window.cancelAnimationFrame
                || window.webkitCancelAnimationFrame
                || window.mozCancelAnimationFrame
                || window.msCancelAnimationFrame
                || function( requestID ) {
                    return clearTimeout(requestID);
                };

            return function(requestID) {
                if ( __requestID !== void 0 ) {
                    cancelAnimationFrame(__requestID);
                    __requestID = void 0;
                }
                if ( requestID !== void 0 ) {
                    cancelAnimationFrame(requestID);
                }
            }
        }

        function reqAnimFrame() {
            var requestAnimationFrame = window.requestAnimationFrame
                || window.webkitRequestAnimationFrame
                || window.mozRequestAnimationFrame
                || window.msRequestAnimationFrame
                || function(callback) {
                    return setTimeout(callback, 1000 / 60);
                };
            var cancelAnimationFrame = canAnimFrame();

            return function(callback) {
                if ( __requestID !== void 0 ) {
                    cancelAnimationFrame();
                }
                __requestID = requestAnimationFrame(callback);
                return __requestID;
            }
        }
        // ADDED BY TERMI: END

        function hasCanvas() {
            // taken from Modernizr
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        }

        function isFunction(obj) {
            // taken from jQuery
            return typeof obj === 'function' || !!(obj && obj.constructor && obj.call && obj.apply);
        }

        function merge() {
            var obj = {},
                key;

            for (var i = 0; i < arguments.length; i++) {
                for (key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        obj[key] = arguments[i][key];
                    }
                }
            }
            return obj;
        }

        return control;
    }; // end canvid function

    return canvid;
})); // end factory function