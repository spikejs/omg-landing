module.exports = function(grunt) {

    require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
        /*"babel": {
            options: {
                sourceMap: true,
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'js/src/',
                        src: ['*.js'],
                        dest: 'js/dist/'
                    }
                ]
            }
        },*/
        browserify: {
            dist: {
                options: {
                    banner: '/* test */',
                    browserifyOptions: {
                        debug: false,
                    },
                    transform: [
                        ["babelify", {
                            sourceType: 'module',
                            presets: ["latest"],
                        }]
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: 'js/src/',
                        src: ['*.js'],
                        dest: 'js/dist/'
                    }
                ]
            }
        },
        uglify: {
            options: {
                // mangle: {
                //     except: ['jQuery', 'Backbone']
                // }
            },
            default: {
                files: {
                    'js/dist/main.min.js': ['js/dist/main.js']
                }
            }
        },
        modernizr: {
            dist: {
                "crawl": false,
                "parseFiles": true,
                "customTests": [],
                "dest": "js/dist/modernizr-custom.js",
                "tests": [
                    "audio",
                    "canvas",
                    "contextmenu",
                    "emoji",
                    "forcetouch",
                    "fullscreen",
                    "pagevisibility",
                    "pointerevents",
                    "svg",
                    "touchevents",
                    "video",
                    "animation",
                    "webgl",
                    "webaudio",
                    "cssanimations",
                    "backgroundsize",
                    "bgsizecover",
                    "borderimage",
                    "csscalc",
                    "csschunit",
                    "csscolumns",
                    "cssexunit",
                    "flexbox",
                    "flexboxlegacy",
                    "flexboxtweener",
                    "flexwrap",
                    "cssgradients",
                    "cssmask",
                    "mediaqueries",
                    "multiplebgs",
                    "objectfit",
                    "csspointerevents",
                    "csspositionsticky",
                    "regions",
                    "cssremunit",
                    "cssresize",
                    "cssscrollbar",
                    "shapes",
                    "csstransforms",
                    "csstransforms3d",
                    "preserve3d",
                    "csstransitions",
                    "userselect",
                    "cssvhunit",
                    "cssvmaxunit",
                    "cssvminunit",
                    "cssvwunit",
                    "wrapflow",
                    "picture",
                    "apng",
                    "sizes",
                    "srcset",
                    "webpalpha",
                    "webpanimation",
                    [
                        "webplossless",
                        "webp-lossless"
                    ],
                    "webp",
                    "inlinesvg",
                    "videoautoplay",
                    "videoloop",
                    "videopreload",
                    "webglextensions"
                ],
                "options": [
                    "domPrefixes",
                    "prefixes",
                    "addTest",
                    "atRule",
                    "hasEvent",
                    "mq",
                    "prefixed",
                    "prefixedCSS",
                    "prefixedCSSValue",
                    "testAllProps",
                    "testProp",
                    "testStyles",
                    "html5shiv",
                    "setClasses"
                ],
                "uglify": true
            }
        },
    });

    grunt.registerTask("default", ["browserify", "uglify"]);
};
