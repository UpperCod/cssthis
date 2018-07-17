'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function connect(list, value) {
    if (!exist(list, value)) { list.push(value); }
    return function disconnect() {
        list.splice(list.indexOf(value) >>> 0, 1);
    };
}

function exist(list, value) {
    return list.indexOf(value) > -1;
}

/**
 * create a random string
 * @param {string} prefix - string to add the random group
 * @param {number} size - longitud del grupo aleatorio
 * @return {string}
 */
function createId(prefix, size) {
    if ( size === void 0 ) size = 3;

    var range =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        id = prefix;
    while (size) {
        --size;
        id += range.charAt(Math.floor(Math.random() * range.length));
    }
    return id;
}
/**
 * create a unique classname
 * @param {string} prefix - string to add the random group
 * @param {number} size - longitud del grupo aleatorio
 * @return {string}.
 */
function createCn(prefix, size) {
    if ( prefix === void 0 ) prefix = "";
    if ( size === void 0 ) size = 3;

    var className = createId(prefix, size);
    if (document.getElementsByClassName(className).length) {
        return createCn(prefix, size + 1);
    } else {
        return className;
    }
}

var config = {
    provider: "[[THEME]]"
};

var Theme = (function (superclass) {
    function Theme() {
        superclass.call(this);
        this.state = {
            cn: createCn("_"),
            handlers: []
        };
    }

    if ( superclass ) Theme.__proto__ = superclass;
    Theme.prototype = Object.create( superclass && superclass.prototype );
    Theme.prototype.constructor = Theme;
    Theme.prototype.commit = function commit (props) {
        var this$1 = this;

        this.state.handlers.forEach(function (handler) { return handler(props, this$1.state.cn); });
    };
    Theme.prototype.getChildContext = function getChildContext () {
        var obj;

        return ( obj = {}, obj[config.provider] = this.state, obj );
    };
    Theme.prototype.componentDidMount = function componentDidMount () {
        this.commit(this.props);
    };
    Theme.prototype.componentWillReceiveProps = function componentWillReceiveProps (props) {
        this.commit(props);
    };
    Theme.prototype.componentWillUnmount = function componentWillUnmount () {
        document.querySelectorAll(("[id^=_" + (this.state.cn) + "_]")).forEach(function (child) {
            document.head.removeChild(child);
        });
    };
    Theme.prototype.render = function render () {
        return this.props.children;
    };

    return Theme;
}(React.Component));

function style(tag, props) {
    if ( tag === void 0 ) tag = "div";
    if ( props === void 0 ) props = {};

    var cn = props.cn || createCn("_"),
        versions = [],
        providers = [];
    return function (fns) {
        fns = [].concat(fns);
        return (function (superclass) {
            function anonymous() {
                superclass.call(this);
                this.state = {};
            }

            if ( superclass ) anonymous.__proto__ = superclass;
            anonymous.prototype = Object.create( superclass && superclass.prototype );
            anonymous.prototype.constructor = anonymous;
            anonymous.prototype.print = function print (props, rewrite) {
                if (!exist(versions, props.cn) || rewrite) {
                    connect(
                        versions,
                        props.cn
                    );
                    var style =
                        document.getElementById(props.cn) ||
                        document.createElement("style");
                    style.id = props.cn;
                    style.innerHTML = fns.map(function (fn) { return fn(props); }).join("\n");
                    document.head.appendChild(style);
                }
                this.setState(props);
            };
            anonymous.prototype.load = function load (props) {
                var this$1 = this;

                var provider = this.context[config.provider];
                if (provider) {
                    if (!exist(versions, provider.cn)) {
                        connect(
                            providers,
                            provider.cn
                        );
                        this.disconnect = connect(
                            provider.handlers,
                            function (providerProps) {
                                props = Object.assign({}, props, providerProps);
                                props.cn = provider.cn + cn;
                                this$1.print(props, true);
                            }
                        );
                    }
                    props.cn = provider.cn + cn;
                } else {
                    props.cn = cn;
                }
                this.print(props);
            };
            anonymous.prototype.componentDidMount = function componentDidMount () {
                this.load(props);
            };
            anonymous.prototype.componentWillUnmount = function componentWillUnmount () {
                if (this.disconnect) {
                    this.disconnect();
                    this.disconnect = false;
                }
            };
            anonymous.prototype.render = function render () {
                var ref = this;
                var props = ref.props;
                var state = ref.state;
                return React.createElement(
                    props.tag || tag,
                    Object.assign({}, props,
                        {className: props.class
                            ? ((state.cn) + " " + (props.class))
                            : state.cn}),
                    props.children
                );
            };

            return anonymous;
        }(React.Component));
    };
}

exports.Theme = Theme;
exports.style = style;
//# sourceMappingURL=cjs.js.map
