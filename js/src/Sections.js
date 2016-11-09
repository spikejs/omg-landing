import scopeSelector from './libs/scopeSelector';

const hasElementsFromPoint = typeof document.elementsFromPoint === 'function';

let defaultRoot = document;
let defaultSectionDescriptor = {
    onCreate(){},
    onActive(isActive){},
    onScroll(scrollTop){},
    onResize(){},
};

class Section {
    constructor(element, root = defaultRoot, sectionDescriptor = void 0) {
        if ( typeof element === 'string' ) {
            element = root.querySelector(element);
        }

        Object.assign(this, defaultSectionDescriptor, sectionDescriptor);

        this.el = element;

        this.resetProp();

        this.onCreate();

        this._isInited = false;
    }

    get offsetTop() {
        return this.el.offsetTop;
    }

    get offsetHeight() {
        return this.el.offsetHeight;
    }

    get offsetBottom() {
        return this.offsetTop + this.offsetHeight;
    }

    resetProp() {
        this.detectId();
    }

    detectId() {
        let sectionId = this.el.getAttribute('data-id');
        if ( !sectionId ) {
            let linkEl = this.el.querySelector(scopeSelector(':scope > a[name]', this.el));
            if ( linkEl ) {
                sectionId = linkEl.getAttribute('name');
            }
        }

        this.id = sectionId || null;
    }

    setActive(isActive) {
        if ( !this._isInited ) {
            this._isInited = true;
        }

        this.isActive = !!isActive;

        this.onActive(this.isActive);

        if ( this.isActive ) {
            this.el.classList.add('active');
        }
        else {
            this.el.classList.remove('active');
        }
    }

    onScroll(scrollTop) {
        this.onScroll(scrollTop);
    }
}

export class Sections {
    constructor(element, root = defaultRoot, {sectionSelector, scrollingElement = null} = {}, sectionsDescriptors = {}) {
        this.root = root;

        if ( typeof element === 'string' ) {
            element = root.querySelector(element);
        }

        this.reset(element);

        this.sectionSelector = scopeSelector(sectionSelector, element);
        this.sectionsDescriptors = sectionsDescriptors;
        this.scrollingElement = scrollingElement || document.scrollingElement;

        this.initSections();
        this.initEvents();
        this.detectCurrentSection();
    }

    get documentContainerHeight() {
        return document.documentElement.clientHeight;
    }

    getScrollTop() {
        return this.scrollingElement.scrollTop;
    }

    reset(element) {
        this.el = element;
        this.sections = [];
    }

    _getSectionDescriptor(el) {
        for ( let sectionDescriptorKey of Object.keys(this.sectionsDescriptors) ) {
            if ( el.matches(sectionDescriptorKey) ) {
                return this.sectionsDescriptors[sectionDescriptorKey] || void 0;
            }
        }

        return void 0;
    }

    initSections() {
        for ( let el of this.root.querySelectorAll(this.sectionSelector) ) {
            this.sections.push(new Section(el, this.root, this._getSectionDescriptor(el)));
        }
    }

    getSectionByScrollTop(scrollTop = this.getScrollTop()) {
        let delta = (this.documentContainerHeight * 20) / 100;// 20%;

        scrollTop += delta;

        for ( let section of this.sections ) {
            if ( scrollTop >= section.offsetTop && scrollTop <= section.offsetBottom ) {
                section.currentPercentTop = ((Math.max(scrollTop - delta - section.offsetTop, 0) * 100) / section.offsetHeight)/* / 100*/;
                section.currentRelativeTop = scrollTop;
                //console.log('section.currentRelativeTop', section.currentRelativeTop, '| section.currentPercentTop', section.currentPercentTop, '| section.offsetTop', section.offsetTop, '| scrollTop - delta', scrollTop - delta);
                return section;
            }
        }
        return null;
    }

    detectCurrentSection(scrollTop = this.getScrollTop()) {
        let currentSection = this.getSectionByScrollTop(scrollTop);

        if ( this.currentSection !== currentSection ) {
            if ( this.currentSection ) {
                this.currentSection.setActive(false);
            }

            this.currentSection = currentSection;

            if ( currentSection ) {
                this.currentSection.setActive(true);

                this.currentSection.onScroll(scrollTop);
            }
        }
    }

    _onScroll() {
        let scrollTop = this.getScrollTop();
        if ( this.currentSection ) {
            this.currentSection.onScroll(scrollTop);
        }

        this.detectCurrentSection(scrollTop);
    }

    _onResize() {
        if ( this.currentSection ) {
            this.currentSection.onResize();
        }

        this._onScroll();
    }

    initEvents() {
        this._onScroll = this._onScroll.bind(this);
        this._onResize = this._onResize.bind(this);

        //TODO:: почему-то это не работает в Chromium
        // this.scrollingElement.addEventListener('scroll', this._onScroll);
        //TODO:: почему-то это не работает в FireFox
        //this.scrollingElement.onscroll = this._onScroll;

        document.addEventListener('scroll', this._onScroll);

        window.addEventListener('resize', this._onResize);
    }

    static setDefaultRoot(root) {
        defaultRoot = root;
    }
}
