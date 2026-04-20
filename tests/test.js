/**
 * Uncorked Duo — test suite
 * Runs with: node tests/test.js
 * No external dependencies required.
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── Tiny test runner ───────────────────────────────────────────────────────
let passed = 0, failed = 0;
function test(name, fn) {
    try {
        fn();
        console.log(`  ✓  ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ✗  ${name}`);
        console.error(`     ${err.message}`);
        failed++;
    }
}
function assert(condition, msg) {
    if (!condition) throw new Error(msg || 'Assertion failed');
}
function assertEqual(a, b, msg) {
    if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// ── Load source files ──────────────────────────────────────────────────────
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const css  = fs.readFileSync(path.join(ROOT, 'css', 'main.css'), 'utf8');
const js   = fs.readFileSync(path.join(ROOT, 'js', 'main.js'), 'utf8');

// ══════════════════════════════════════════════════════════════════════════
// 1. FILE STRUCTURE
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── File structure ──────────────────────────────────────');

test('index.html exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'index.html')));
});
test('css/main.css exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'css', 'main.css')));
});
test('js/main.js exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'js', 'main.js')));
});
test('image asset exists', () => {
    assert(fs.existsSync(path.join(ROOT, 'Uncorked Duo.png')));
});

// ══════════════════════════════════════════════════════════════════════════
// 2. HTML — external asset linking
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── HTML: external asset linking ────────────────────────');

test('links to css/main.css stylesheet', () => {
    assert(html.includes('<link rel="stylesheet" href="css/main.css">'),
        'Missing <link rel="stylesheet" href="css/main.css">');
});
test('links to js/main.js script', () => {
    assert(html.includes('<script src="js/main.js">'),
        'Missing <script src="js/main.js">');
});
test('no inline <style> block remains', () => {
    assert(!/<style[\s>]/i.test(html), 'Found a <style> block in index.html');
});
test('no inline <script> block with code remains', () => {
    // Strip HTML comments first (the Instagram widget example has a commented-out <script>)
    const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
    // Allow the external <script src="..."> tag but no inline script content
    const withoutExternal = withoutComments.replace(/<script src="js\/main\.js"><\/script>/g, '');
    assert(!/<script[\s>]/i.test(withoutExternal), 'Found an inline <script> block in index.html');
});

// ══════════════════════════════════════════════════════════════════════════
// 3. HTML — page structure
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── HTML: page structure ────────────────────────────────');

test('has navigation element', () => {
    assert(html.includes('<nav class="nav">'), 'Nav element missing');
});
test('has hero section', () => {
    assert(html.includes('id="home"'), 'Hero section missing');
});
test('has about section', () => {
    assert(html.includes('id="about"'), 'About section missing');
});
test('has offer section', () => {
    assert(html.includes('id="offer"'), 'Offer section missing');
});
test('has collab section', () => {
    assert(html.includes('id="collab"'), 'Collab section missing');
});
test('has instagram section', () => {
    assert(html.includes('id="instagram"'), 'Instagram section missing');
});
test('has contact section', () => {
    assert(html.includes('id="contact"'), 'Contact section missing');
});
test('has footer', () => {
    assert(html.includes('<footer class="footer">'), 'Footer missing');
});

// ══════════════════════════════════════════════════════════════════════════
// 4. HTML — modals
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── HTML: modals ────────────────────────────────────────');

const MODALS = ['modal-about', 'modal-travel', 'modal-education', 'modal-tastings'];
function extractModalBlock(html, id) {
    const start = html.indexOf(`id="${id}"`);
    if (start === -1) return '';
    // End is either the next modal comment or the closing script tag (last modal)
    let end = html.indexOf('\n<!-- Modal:', start + 1);
    if (end === -1) end = html.indexOf('<script src="js/main.js">', start);
    return end === -1 ? html.slice(start) : html.slice(start, end);
}

MODALS.forEach(id => {
    test(`modal #${id} exists`, () => {
        assert(html.includes(`id="${id}"`), `Modal #${id} not found`);
    });
    test(`modal #${id} has modal-header`, () => {
        const block = extractModalBlock(html, id);
        assert(block.includes('class="modal-header"'), `#${id} is missing modal-header`);
    });
    test(`modal #${id} has modal-scroll`, () => {
        const block = extractModalBlock(html, id);
        assert(block.includes('class="modal-scroll"'), `#${id} is missing modal-scroll`);
    });
    test(`modal #${id} has close button`, () => {
        const block = extractModalBlock(html, id);
        assert(block.includes('class="modal-close"'), `#${id} is missing modal-close button`);
    });
    test(`modal #${id} close button calls closeModal`, () => {
        const block = extractModalBlock(html, id);
        assert(block.includes(`closeModal('${id}')`), `#${id} close button does not call closeModal`);
    });
});

// ══════════════════════════════════════════════════════════════════════════
// 5. HTML — contact / collab links
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── HTML: contact links ─────────────────────────────────');

test('contact email has correct mailto with subject', () => {
    assert(html.includes("mailto:uncorkedduowine@gmail.com?subject=Let%27s%20raise%20a%20glass%20together"),
        'Contact email mailto subject missing or wrong');
});
test('collab CTA has mailto link', () => {
    assert(html.includes('mailto:uncorkedduowine@gmail.com?subject=Collaboration%20Enquiry'),
        'Collab CTA mailto missing');
});
test('about section content column is clickable (about-clickable)', () => {
    assert(html.includes('class="about-clickable"'), 'about-clickable class missing');
    assert(html.includes("onclick=\"openModal('modal-about')\""), 'about-clickable onclick missing');
});
test('about-clickable has keyboard support', () => {
    assert(html.includes('onkeydown') && html.includes("openModal('modal-about')"),
        'about-clickable missing keyboard handler');
});
test('css disables about-clickable pointer on desktop', () => {
    const desktopBlock = css.slice(css.indexOf('@media (min-width: 820px)'));
    assert(desktopBlock.includes('.about-clickable') && desktopBlock.includes('pointer-events: none'),
        'Desktop should disable about-clickable pointer-events');
});

test('collab swipe hint is present', () => {
    assert(html.includes('class="collab-swipe-hint"'), 'Collab swipe hint missing');
});
test('collab dots are present (5 dots)', () => {
    const dotMatches = (html.match(/class="collab-dot/g) || []).length;
    // collab-dots container + 5 individual dots = 6 occurrences of "collab-dot"
    assert(dotMatches >= 5, `Expected at least 5 collab-dot elements, found ${dotMatches}`);
});

// ══════════════════════════════════════════════════════════════════════════
// 6. CSS — key rules present
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── CSS: key rules ──────────────────────────────────────');

test('CSS variables defined', () => {
    assert(css.includes(':root') && css.includes('--cream') && css.includes('--charcoal'),
        'CSS custom properties missing');
});
test('desktop media query present', () => {
    assert(css.includes('@media (min-width: 820px)'), 'Desktop breakpoint missing');
});
test('.modal rule present', () => {
    assert(css.includes('.modal {') || css.includes('.modal{'), '.modal rule missing');
});
test('.modal-header rule present', () => {
    assert(css.includes('.modal-header'), '.modal-header rule missing');
});
test('.modal-scroll rule present', () => {
    assert(css.includes('.modal-scroll'), '.modal-scroll rule missing');
});
test('.modal uses overflow: hidden (not overflow-y: auto)', () => {
    // The .modal should use overflow: hidden so the header doesn't scroll
    const modalBlock = css.slice(css.indexOf('.modal {'), css.indexOf('.modal {') + 300);
    assert(modalBlock.includes('overflow: hidden'), '.modal should have overflow: hidden');
    assert(!modalBlock.includes('overflow-y: auto'), '.modal should not have overflow-y: auto (that belongs on .modal-scroll)');
});
test('.modal-scroll has overflow-y: auto', () => {
    assert(css.includes('overflow-y: auto'), '.modal-scroll should have overflow-y: auto');
});
test('.nav rule present', () => {
    assert(css.includes('.nav {') || css.includes('.nav{'), '.nav rule missing');
});
test('.hero rule present', () => {
    assert(css.includes('.hero {') || css.includes('.hero{'), '.hero rule missing');
});
test('keyframes defined', () => {
    assert(css.includes('@keyframes riseUp'), '@keyframes riseUp missing');
    assert(css.includes('@keyframes breathe'), '@keyframes breathe missing');
    assert(css.includes('@keyframes scrollDown'), '@keyframes scrollDown missing');
});
test('.collab-list has scroll-snap-type', () => {
    assert(css.includes('scroll-snap-type'), '.collab-list scroll-snap-type missing');
});

// ══════════════════════════════════════════════════════════════════════════
// 7. JS — function declarations
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── JS: function declarations ───────────────────────────');

test('openModal function defined', () => {
    assert(js.includes('function openModal('), 'openModal function missing');
});
test('closeModal function defined', () => {
    assert(js.includes('function closeModal('), 'closeModal function missing');
});
test('toggleMenu function defined', () => {
    assert(js.includes('function toggleMenu('), 'toggleMenu function missing');
});
test('closeMenu function defined', () => {
    assert(js.includes('function closeMenu('), 'closeMenu function missing');
});
test('IntersectionObserver used for fade-in', () => {
    assert(js.includes('IntersectionObserver'), 'IntersectionObserver missing');
});
test('Escape key listener present', () => {
    assert(js.includes("'Escape'"), 'Escape key handler missing');
});
test('backdrop click closes modal', () => {
    assert(js.includes('e.target === overlay'), 'Backdrop click handler missing');
});
test('carousel dot update logic present', () => {
    assert(js.includes('collab-dot') && js.includes('scrollLeft'), 'Carousel dot logic missing');
});

// ══════════════════════════════════════════════════════════════════════════
// 8. JS — logic tests with DOM mock
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── JS: logic (DOM mock) ────────────────────────────────');

// Build a minimal DOM mock so we can eval main.js
function createDomMock() {
    const elements = {};
    const eventListeners = {};

    function makeEl(id) {
        return {
            id,
            classList: {
                _classes: new Set(),
                add(...c)    { c.forEach(x => this._classes.add(x)); },
                remove(...c) { c.forEach(x => this._classes.delete(x)); },
                toggle(c, force) {
                    if (force === undefined) {
                        if (this._classes.has(c)) { this._classes.delete(c); return false; }
                        else { this._classes.add(c); return true; }
                    }
                    force ? this._classes.add(c) : this._classes.delete(c);
                    return force;
                },
                has(c) { return this._classes.has(c); },
            },
            style: {},
            getAttribute() { return null; },
            setAttribute() {},
            focus() {},
            addEventListener(ev, fn) {
                if (!this._listeners) this._listeners = {};
                this._listeners[ev] = this._listeners[ev] || [];
                this._listeners[ev].push(fn);
            },
            querySelector(sel) {
                if (sel === '.modal-close') return makeEl('close-btn');
                return null;
            },
            querySelectorAll() { return []; },
        };
    }

    const body = makeEl('body');
    const mockDoc = {
        querySelector(sel) {
            if (sel === '.nav') return makeEl('nav');
            if (sel === '.nav-hamburger') return makeEl('hamburger');
            return makeEl(sel);
        },
        getElementById(id) {
            if (!elements[id]) elements[id] = makeEl(id);
            return elements[id];
        },
        querySelectorAll(sel) {
            if (sel === '.fi') return [];
            if (sel === '.collab-dot') return [];
            if (sel === '.modal-overlay') return [];
            if (sel === '.modal-overlay.open') return [];
            return [];
        },
        body,
        addEventListener(ev, fn) {
            eventListeners[ev] = eventListeners[ev] || [];
            eventListeners[ev].push(fn);
        },
    };

    const mockWindow = {
        scrollY: 0,
        addEventListener(ev, fn) {
            eventListeners[ev] = eventListeners[ev] || [];
            eventListeners[ev].push(fn);
        },
        _listeners: eventListeners,
    };

    return { mockDoc, mockWindow, elements, eventListeners, body };
}

test('openModal adds "open" class and locks body scroll', () => {
    const { mockDoc, mockWindow, elements, body } = createDomMock();
    const fn = new Function('document', 'window', 'IntersectionObserver', js + '\nreturn { openModal, closeModal };');
    const { openModal, closeModal } = fn(mockDoc, mockWindow, class { constructor(cb, opts) {} observe() {} });

    openModal('modal-travel');
    assert(elements['modal-travel'].classList.has('open'), 'modal-travel should have class "open"');
    assertEqual(body.style.overflow, 'hidden', 'body.style.overflow should be "hidden"');
});

test('closeModal removes "open" class and restores body scroll', () => {
    const { mockDoc, mockWindow, elements, body } = createDomMock();
    const fn = new Function('document', 'window', 'IntersectionObserver', js + '\nreturn { openModal, closeModal };');
    const { openModal, closeModal } = fn(mockDoc, mockWindow, class { constructor(cb, opts) {} observe() {} });

    openModal('modal-education');
    closeModal('modal-education');
    assert(!elements['modal-education'].classList.has('open'), 'modal-education should not have "open" class');
    assertEqual(body.style.overflow, '', 'body.style.overflow should be restored to ""');
});

test('toggleMenu opens the mobile menu', () => {
    const { mockDoc, mockWindow, elements, body } = createDomMock();
    // Pre-register the mobile-menu element
    elements['mobile-menu'] = (() => {
        const el = mockDoc.getElementById('mobile-menu');
        return el;
    })();
    const fn = new Function('document', 'window', 'IntersectionObserver', js + '\nreturn { toggleMenu, closeMenu };');
    const { toggleMenu, closeMenu } = fn(mockDoc, mockWindow, class { constructor(cb, opts) {} observe() {} });

    toggleMenu();
    assert(elements['mobile-menu'].classList.has('open'), 'mobile-menu should have class "open" after toggleMenu');
    assertEqual(body.style.overflow, 'hidden', 'body should be locked when menu is open');
});

test('closeMenu removes open state from mobile menu', () => {
    const { mockDoc, mockWindow, elements, body } = createDomMock();
    elements['mobile-menu'] = mockDoc.getElementById('mobile-menu');
    const fn = new Function('document', 'window', 'IntersectionObserver', js + '\nreturn { toggleMenu, closeMenu };');
    const { toggleMenu, closeMenu } = fn(mockDoc, mockWindow, class { constructor(cb, opts) {} observe() {} });

    toggleMenu(); // open
    closeMenu();  // close
    assert(!elements['mobile-menu'].classList.has('open'), 'mobile-menu should not have "open" after closeMenu');
    assertEqual(body.style.overflow, '', 'body scroll should be restored after closeMenu');
});

// ══════════════════════════════════════════════════════════════════════════
// Results
// ══════════════════════════════════════════════════════════════════════════
console.log(`\n${'─'.repeat(55)}`);
console.log(`  ${passed} passed  |  ${failed} failed`);
console.log(`${'─'.repeat(55)}\n`);
process.exit(failed > 0 ? 1 : 0);
