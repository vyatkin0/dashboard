import React from 'react';
import styles from './tooltip.module.css';

interface TooltipProps {
    title: string;
}

function buildNodes(content: string, className: string) {
    const tooltipEl = document.createElement('div');

    tooltipEl.classList.add(className);

    const temporaryDOM = new DOMParser().parseFromString(content, 'text/html');

    const tooltipContentEl = temporaryDOM.body.childNodes;

    Array.from(tooltipContentEl).forEach(p => tooltipEl.appendChild(p));

    return tooltipEl;
}

function setPosition(element: HTMLDivElement, mouseTop: number, mouseLeft: number) {

    const CURSOR_SIZE = 32;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const plateHeight = element.clientHeight;
    const plateWidth = element.clientWidth;

    const top = mouseTop + plateHeight + CURSOR_SIZE >= windowHeight ?
        mouseTop - plateHeight - CURSOR_SIZE :
        mouseTop + CURSOR_SIZE;

    const left = mouseLeft + plateWidth >= windowWidth ?
        mouseLeft - plateWidth :
        mouseLeft;

    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
}

const Tooltip: React.FC<React.PropsWithChildren<TooltipProps>> = (props) => {
    const [focused, setFocused] = React.useState(false);
    const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout>();
    const [opacityTimeoutId, setOpacityTimeoutId] = React.useState<NodeJS.Timeout>();
    const [element, setElement] = React.useState<HTMLDivElement>();
    const mousePosRef = React.useRef({top:0, left:0});

    const mousePos = mousePosRef.current;
    
    const dispose = React.useCallback(()=>{
        if (element && document.body.contains(element)) {
            document.body.removeChild(element);
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        if (opacityTimeoutId) {
            clearTimeout(opacityTimeoutId);
        }
    }, [element, timeoutId, opacityTimeoutId]);

    function onMouseLeave(event?: React.MouseEvent) {
        dispose();
        setOpacityTimeoutId(undefined);
        setTimeoutId(undefined);
        setElement(undefined);
    }

    function setFocus(focus: boolean) {
        setFocused(focus);
        onMouseLeave();
    }

    function onMouseEnter(event: React.MouseEvent) {
        if (focused || timeoutId) {
            return;
        }
        
        const t = setTimeout(
            () => {
                const el = buildNodes(props.title||'', styles.content);
                setPosition(el, mousePos.top, mousePos.left);

                document.body.appendChild(el);

                setElement(el);

                const ot = setTimeout(()=>{el.style.opacity = '1';}, 0);
                setOpacityTimeoutId(ot);
            },
            700,
        );

        setTimeoutId(t);
    }
    
    function onMouseMove(event: React.MouseEvent) {
        if (focused || !timeoutId) {
            return;
        }
        
        mousePos.left = event.clientX;
        mousePos.top = event.clientY;

        if(element) {
            setPosition(element, event.clientY, event.clientX);
        }
    }

    React.useEffect(() => {
        return dispose;
    }, [dispose]);

    return <div className={focused ? undefined : styles.body}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onClick = {onMouseLeave}
        onMouseLeave = {onMouseLeave}
        onMouseEnter = {onMouseEnter}
        onMouseMove = {onMouseMove}>
        {props.children}
    </div>
};

export default Tooltip;