import * as React from "react";
import * as ReactDOM from "react-dom";

interface IPortalProps {
    content: React.ReactElement<any>;
    container: Element;
}

export class Portal extends React.PureComponent<IPortalProps> {

    public render() {
        return ReactDOM.createPortal(this.props.content, this.props.container);
    }

}
