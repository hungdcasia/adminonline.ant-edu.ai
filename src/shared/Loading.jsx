import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

class Loading extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        var { loading } = this.props;
        if (loading.loading <= 0) {
            return (<></>);
        }
        return (
            <section className="Loading_wrapper" ><section className="loader"></section></section>
        );
    }
}

function mapStateToProps(state) {
    const { loading } = state;
    return { loading };
}

const actionCreators = {};

const connectedPage = connect(mapStateToProps, actionCreators)(Loading);

export { connectedPage as Loading }