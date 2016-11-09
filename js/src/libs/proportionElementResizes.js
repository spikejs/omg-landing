
export function getElementSizes(el, isInner) {
    let width = -1, height = -1;

    if ( el === window ) {
        let doc = document.documentElement;
        width = doc.clientWidth;
        height = doc.clientHeight;
    }
    else if ( el.nodeType === 9 ) {
        let body = document.body;
        let doc = document.documentElement;

        width = Math[isInner ? "min" : "max"](
            body.scrollWidth, doc.scrollWidth,
            body.offsetWidth, doc.offsetWidth,
            doc.clientWidth
        );

        height = Math[isInner ? "min" : "max"](
            body.scrollHeight, doc.scrollHeight,
            body.offsetHeight, doc.offsetHeight,
            doc.clientHeight
        );
    }
    else if ( el.nodeType ) {
        width = el.offsetWidth;
        height = el.offsetHeight;
    }
    else {
        width = el.width;
        height = el.height;
    }

    let isPortrait = height > width;

    return {width, height, isPortrait};
}

function calMaxWidth(width, contWidth, height, contHeight) {
    let proportion = contWidth / width;

    height = height * proportion;
    width = contWidth;

    let delta = (contHeight - height) / 2;

    return {
        proportion,
        delta,
        width,
        height,
    }
}

function calMaxHeight(width, contWidth, height, contHeight) {
    let proportion = contHeight / height;

    width = width * proportion;
    height = contHeight;

    let delta = (contWidth - width) / 2;

    return {
        proportion,
        delta,
        width,
        height,
    }
}

export function getProportionSizes(container, el) {
    let {width, height, isPortrait: isElementPortrait} = getElementSizes(el, false);
    let originalWidth = width, originalHeight = height;
    let {width: contWidth, height: contHeight, isPortrait: isContainerPortrait} = getElementSizes(container, true);
    let left = 0, right = 0, top = 0, bottom = 0;

    let maxHeight = false, maxWidth = false;

    if ( isElementPortrait ) {
        maxWidth = !isContainerPortrait;
        maxHeight = isContainerPortrait;

    }
    else {
        maxWidth = isContainerPortrait;
        maxHeight = !isContainerPortrait;
    }

    if ( maxWidth ) {
        let {width: newWidth, height: newHeight, delta} = calMaxWidth(width, contWidth, height, contHeight);

        if ( delta > 0 ) {
            let {width: newWidth, height: newHeight, delta} = calMaxHeight(width, contWidth, height, contHeight);
            width = newWidth;
            height = newHeight;
            left = delta;
            right = delta;
        }
        else {
            width = newWidth;
            height = newHeight;
            top = delta;
            bottom = delta;
        }

    }
    else if ( maxHeight ) {
        let {width: newWidth, height: newHeight, delta} = calMaxHeight(width, contWidth, height, contHeight);

        if ( delta > 0 ) {
            let {width: newWidth, height: newHeight, delta} = calMaxWidth(width, contWidth, height, contHeight);
            width = newWidth;
            height = newHeight;
            top = delta;
            bottom = delta;
        }
        else {
            width = newWidth;
            height = newHeight;
            left = delta;
            right = delta;
        }
    }

    return {
        width,
        height,
        left,
        right,
        top,
        bottom,
        originalWidth,
        originalHeight,
        contWidth,
        contHeight,
        isElementPortrait,
        isContainerPortrait,
        maxHeight,
        maxWidth,
    };
}