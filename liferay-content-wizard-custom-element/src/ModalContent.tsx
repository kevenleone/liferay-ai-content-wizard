export default function ModalContent(
        {onClose} : {onClose:any}
    ) {
    return (
        <>HERE
        <div className="modal-dialog ">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="modal-title" id="claySmallModalLabel">
                        AI Assistant
                    </div>
                    <button
                        aria-label="Close"
                        title="Close"
                        className="close"
                        data-dismiss="modal"
                        role="button"
                        type="button"
                        onClick={onClose}
                    >
                        <svg aria-hidden="true" className="lexicon-icon lexicon-icon-pencil" focusable="false">
                        <use href="/o/classic-theme/images/clay/icons.svg#times"></use>
                    </svg>
                    </button>
                </div>
                <div className="modal-body">
                    <img src="http://localhost:8080/documents/d/guest/mock"/>
                </div>
                <div className="modal-footer">
                    <div className="modal-item-last">
                        <div className="btn-group">
                            <div className="btn-group-item">
                                <button
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </div>
                            <div className="btn-group-item">
                                <button className="btn btn-primary" type="button">
                                    Primary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
  }
  