const TimeCoundown = ({ days, hours, minutes, seconds, completed }) => {
    return (
        <>
            <div className="countdown d-none d-sm-block">
                <div className='countdown-card'>
                    <div className="countdown-value">{days}</div>
                    <div className="countdown-unit">Ngày</div>
                </div>
                <div className='countdown-card'>
                    <div className="countdown-value">{hours}</div>
                    <div className="countdown-unit">Giờ</div>
                </div>
                <div className='countdown-card'>
                    <div className="countdown-value">{minutes}</div>
                    <div className="countdown-unit">Phút</div>
                </div>
                <div className='countdown-card'>
                    <div className="countdown-value">{seconds}</div>
                    <div className="countdown-unit">Giây</div>
                </div>
            </div>
            <div className="countdown d-block d-sm-none">
                <div className='countdown-card px-2'>
                    <div className="countdown-value">{hours + days * 24} : {minutes} : {seconds}</div>
                </div>
            </div>
        </>
    )
}

export { TimeCoundown }