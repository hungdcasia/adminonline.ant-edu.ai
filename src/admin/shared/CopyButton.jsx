import { CopyToClipboard } from 'react-copy-to-clipboard';
import { alertActions } from '../../actions';

const CopyButton = ({ value, className }) => {
    return (
        <CopyToClipboard text={value} onCopy={() => { alertActions.success("Sao chép thành công") }}>
            <div className={'btn btn-md py-0 px-2 ' + className ?? ''} onClick={() => { }}><i className="far fa-clone"></i></div>
        </CopyToClipboard>

    )
}

export { CopyButton }