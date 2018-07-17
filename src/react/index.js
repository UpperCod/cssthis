import React from "react";
import { connect, exist, createCn } from "../utils";

let config = {
    provider: "[[THEME]]"
};

class Theme extends React.Component {
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
    render() {
        return this.props.children;
    }
}

function style(tag = "div", props = {}) {
    let cn = props.cn || createCn("_"),
        versions = [],
        providers = [];
    return fns => {
        fns = [].concat(fns);
        return class extends React.Component {
            constructor() {
                super();
                this.state = {};
            }
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
            render() {
                let { props, state } = this;
                return React.createElement(
                    props.tag || tag,
                    {
                        ...props,
                        className: props.class
                            ? `${state.cn} ${props.class}`
                            : state.cn
                    },
                    props.children
                );
            }
        };
    };
}

export { Theme, style };
