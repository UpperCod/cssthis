import { h, Component } from "preact";
import { connect, exist, createCn } from "./utils";

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
        document
            .querySelectorAll(`style[id^=_${this.state.cn}_]`)
            .forEach(child => {
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
        providers = [];

    return fns => {
        fns = [].concat(fns);
        return class extends Component {
            print(props, rewrite) {
                props.id = "." + props.cn;
                if (!exist(versions, props.cn) || rewrite) {
                    connect(
                        versions,
                        props.cn
                    );
                    let element =
                        document.getElementById(props.cn) ||
                        document.createElement("style");
                    element.id = props.cn;
                    /**
                     * the option to preprocess the string entered
                     * to cssthis is added, to test it in environments
                     * free of bundle tools.
                     * It is recommended not to use this option in production.
                     * since it's just to exemplify the use of CSSTHIs.
                     * Repeat, do not use the `style.parse` method in production.
                     */
                    element.innerHTML = fns
                        .map(fn => (style.parse ? style.parse(fn) : fn)(props))
                        .join("\n");

                    document.head.appendChild(element);
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
                this.load({ ...props });
            }
            componentWillUnmount() {
                if (this.disconnect) {
                    this.disconnect();
                    this.disconnect = false;
                }
            }
            render(props, state) {
                return h(props.tag || tag, {
                    ...props,
                    class: props.class
                        ? `${state.cn} ${props.class}`
                        : state.cn,
                    children: props.children
                });
            }
        };
    };
}

export { Theme, style };
