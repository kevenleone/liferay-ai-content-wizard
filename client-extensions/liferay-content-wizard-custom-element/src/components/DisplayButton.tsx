export default function DisplayButton({ onClick }: { onClick: any }) {
    return (
        <div id="AIButton">
            <div className="button-wrapper">
                <button className="button" type="button" onClick={onClick}>
                    <span className="icon-monospaced">
                        <svg
                            aria-hidden="true"
                            className="lexicon-icon lexicon-icon-pencil"
                            focusable="false"
                        >
                            <use href="/o/classic-theme/images/clay/icons.svg#stars"></use>
                        </svg>
                    </span>
                    &nbsp; Liferay Assistant
                </button>
                <div className="button-bg"></div>
            </div>
        </div>
    );
}
