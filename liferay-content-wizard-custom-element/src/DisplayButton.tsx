export default function DisplayButton({onClick} : {onClick:any}) {
  return (
    <li className="control-menu-nav-item">
		<span className=" lfr-portal-tooltip" title="AI Assistant">		
            <a href="#" 
	            data-target="#clayDefaultModal" 
                onClick={onClick} className="btn btn-monospaced btn-sm control-menu-nav-link lfr-icon-item taglib-icon">
                <span className="icon-monospaced">
                    <svg aria-hidden="true" className="lexicon-icon lexicon-icon-pencil" focusable="false">
                        <use href="/o/classic-theme/images/clay/icons.svg#stars"></use>
                    </svg>
                </span>	
                <span className="taglib-text hide-accessible sr-only">AI Assistant</span>
            </a>		
		</span>
    </li>
  );
}
