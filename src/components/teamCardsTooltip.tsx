import React from 'react';
import styles from './teamCardsTooltip.module.css';
import { default as IndicatorsCardGroup, IndicatorsCardsProps } from './indicatorsCardsGroup';
import { IndicatorProps } from './indicatorsCard';
import { apiUrl } from '../config';

export const tooltipWidth = 928;

interface TeamCardsTooltipProps {
    teamId: number;
    connectionLeft: number;
    top: number;
    left: number;
    onClose: ()=>void;
}

interface TeamStats {
    teamCards?: IndicatorsCardsProps[];
    loading: boolean;
    error?: string;
}

type Action =
    | { type: 'loading'; payload: boolean }
    | { type: 'loaded'; payload: IndicatorsCardsProps[] }
    | { type: 'error'; payload: string };

const reducer = (_state: TeamStats, action: Action): TeamStats => {
    switch (action.type) {
        case 'loading':
            return { loading: action.payload };
        case 'loaded':
            return { teamCards: action.payload, loading: false };
        case 'error':
            return { error: action.payload, loading: false };
        default:
            throw new Error();
    }
}

const getTeamCards = (data: { products: IndicatorProps[]; productTypes: IndicatorProps[]; components: IndicatorProps[] }): IndicatorsCardsProps[] => [
    {
        image: 'thumb_up',
        title: 'Products',
        info: {
            title: 'Status',
            indicators: data.products,
        },
    },
    {
        info: {
            title: 'Type',
            indicators: data.productTypes,
        },
    },
    {
        image: 'grid_view',
        title: 'Components',
        info: {
            title: 'Status',
            indicators: data.components,
        },
    },
];

const TeamCardsTooltip = (props: TeamCardsTooltipProps): JSX.Element => {
    const [teamStats, dispatch] = React.useReducer(
        reducer,
        {} as TeamStats
    );

    React.useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        dispatch({ type: 'loading', payload: true });
        fetch(`${apiUrl}/teamstats/${props.teamId}`, {
            signal,
        })
            .then((data) => {
                data.json().then((payload) => {
                    const teamCards = getTeamCards(payload);
                    dispatch({ type: 'loaded', payload: teamCards });
                });
            })
            .catch((e) => dispatch({ type: 'error', payload: e.message }))
            .finally(() => {
                dispatch({ type: 'loading', payload: false });
            });
        return () => {
            controller.abort();
        };
    }, []);

    const tooltipStyle = {
        width: tooltipWidth,
        top: props.top,
        left: props.left,
    };

    let content;
    if (teamStats.loading) {
        content = 'Loading...';
    } else if (teamStats.error) {
        content = teamStats.error;
    } else if (teamStats.teamCards) {
        content = <IndicatorsCardGroup cards={teamStats.teamCards} />;
    }

    return <div className={styles.tooltip} style={tooltipStyle}>
        <div className={styles.tooltipTitle}>
            <button
                onClick={props.onClose}
                className={styles.close}
            >
                <span className='material-symbols-outlined'>
                    close
                </span>
            </button>
        </div>
        <div className={styles.tooltipContent}>
            {content}
        </div>
    </div>;
}

export default TeamCardsTooltip;
