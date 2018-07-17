import { h, Component } from 'preact';

function connect(list, value) {
    if (!exist(list, value)) list.push(value);
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
function createId(prefix, size = 3) {
    let range =
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
function createCn(prefix = "", size = 3) {
    let className = createId(prefix, size);
    if (document.getElementsByClassName(className).length) {
        return createCn(prefix, size + 1);
    } else {
        return className;
    }
}

let config = {
    provider: "[[THEME]]"
};

class Theme extends Component {
    constructor() {
        super();
        this.state = {
            cn: createCn("_"),
            handlers: []
        };
    }
    commit(props) {
        this.state.handlers.forEach(handler => handler(props, this.state.cn));
    }
    getChildContext() {
        return {
            [config.provider]: this.state
        };
    }
    componentDidMount() {
        this.commit(this.props);
    }
    componentWillReceiveProps(props) {
        this.commit(props);
    }
    componentWillUnmount() {
        document.querySelectorAll(`[id^=_${this.state.cn}_]`).forEach(child => {
            document.head.removeChild(child);
        });
    }
    render(props) {
        return props.children[0];
    }
}

function style(tag = "div", props = {}) {
    let cn = props.cn || createCn("_"),
        versions = [],
        providers = [],
        prerender;

    return fns => {
        fns = [].concat(fns);
        return class extends Component {
            print(props, rewrite) {
                if (!exist(versions, props.cn) || rewrite) {
                    connect(
                        versions,
                        props.cn
                    );
                    let style =
                        document.getElementById(props.cn) ||
                        document.createElement("style");
                    style.id = props.cn;
                    style.innerHTML = fns.map(fn => fn(props)).join("\n");
                    document.head.appendChild(style);
                }
                this.setState(props);
            }
            load(props) {
                let provider = this.context[config.provider];
                if (provider) {
                    if (!exist(versions, provider.cn)) {
                        connect(
                            providers,
                            provider.cn
                        );
                        this.disconnect = connect(
                            provider.handlers,
                            providerProps => {
                                props = { ...props, ...providerProps };
                                props.cn = provider.cn + cn;
                                this.print(props, true);
                            }
                        );
                    }
                    props.cn = provider.cn + cn;
                } else {
                    props.cn = cn;
                }
                this.print(props);
            }
            componentDidMount() {
                this.load(props);
            }
            componentWillUnmount() {
                if (this.disconnect) {
                    this.disconnect();
                    this.disconnect = false;
                }
            }
            static render(callback) {
                prerender = callback;
                return this;
            }
            render(props, state) {
                return h(props.tag || tag, {
                    ...props,
                    class: props.class
                        ? `${state.cn} ${props.class}`
                        : state.cn,
                    children: prerender ? prerender(props) : props.children
                });
            }
        };
    };
}

export { Theme, style };
//# sourceMappingURL=index.js.map
