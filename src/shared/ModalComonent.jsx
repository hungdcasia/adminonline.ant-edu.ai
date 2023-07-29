import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { modalActions } from "../actions";
import { history } from "../helpers";

const Modal = (props) => {
    const { show, options } = props.modal;
    if (!show) {
        return (<></>);
    }
    return (
        <div className="Canvas_canvas Canvas_canvasSemiTransparentBlack">
            <div className="CanvasContent_base CanvasContent_centered">
                <div className="Dialog_dialog">
                    <div className="Dialog_content">
                        <p className="Dialog_text">{options.title ?? "Thông báo"}</p>
                    </div>
                    <div className="Dialog_footer">
                        <button className="ranks_text base_button sizes_m Dialog_button Dialog_cancel Dialog_second tooltip_tooltip"
                            type="button"
                            onClick={() => {
                                modalActions.clear();
                                options.onCancel?.call();
                            }}
                        >
                            <div className="base_inner sizes_inner"><span className="base_text">{options.cancel ?? 'Hủy bỏ'}</span></div>
                        </button>
                        <button className="ranks_text base_button sizes_m Dialog_button tooltip_tooltip"
                            type="button"
                            onClick={() => {
                                modalActions.clear();
                                options.onOk?.call()
                            }}
                        >
                            <div className="base_inner sizes_inner"><span className="base_text">{options.ok ?? 'Đồng ý'}</span></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


function mapStateToProps(state) {
    const { modal } = state;
    return { modal };
}

const actionCreators = {};

const connectedPage = connect(mapStateToProps, actionCreators)(Modal);

export { connectedPage as Modal }