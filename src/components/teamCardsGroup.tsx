import React from 'react';
import StatHeader from './statHeader';
import styles from './teamCards.module.css';
import { default as IndicatorsCardGroup, IndicatorsCardsProps } from './indicatorsCardsGroup';
import { IndicatorProps } from './indicatorsCard';
import { apiUrl } from '../config';

const tooltipWidth = 928;
const tooltipPadding = 24;

export interface TeamCard {
    teamId: number;
    title: string;
    leader: string;
    count: number;
}

interface TeamCardsGroupProps {
    teamProducts: TeamCard[];
}

interface TooltipInfo {
    teamId: number;
    teamCards?: IndicatorsCardsProps[];
    connectionLeft: number;
    top: number;
    left: number;
}

interface TeamStats {
    tooltipInfo?: TooltipInfo;
    loading: boolean;
    error?: string;
}

type Action =
    | { type: 'tooltip'; payload: TooltipInfo | undefined }
    | { type: 'loading'; payload: boolean }
    | { type: 'loaded'; payload: IndicatorsCardsProps[] }
    | { type: 'error'; payload: string };

const reducer = (state: TeamStats, action: Action): TeamStats => {
    switch (action.type) {
        case 'tooltip':
            return { tooltipInfo: action.payload, loading: false };
        case 'loading':
            return { ...state, loading: action.payload };
        case 'loaded':
            const s: TeamStats = { loading: false };
            if (state.tooltipInfo) {
                s.tooltipInfo = { ...state.tooltipInfo, teamCards: action.payload };
            }
            return s;
        case 'error':
            return { ...state, error: action.payload, loading: false };
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

const TeamCardsGroup = (props: TeamCardsGroupProps): JSX.Element => {
    const [teamStats, dispatch] = React.useReducer(
        reducer,
        {} as TeamStats
    );

    React.useEffect(() => {
        if (!teamStats.tooltipInfo?.teamId) {
            return;
        }
        const controller = new AbortController();
        const signal = controller.signal;
        dispatch({ type: 'loading', payload: true });
        fetch(`${apiUrl}/teamstats/${teamStats.tooltipInfo.teamId}`, {
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
    }, [teamStats.tooltipInfo?.teamId]);

    const onTeamClick = (
        teamId: number,
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const currentTarget = e?.currentTarget as HTMLElement;
        if (!currentTarget) {
            dispatch({ type: 'tooltip', payload: undefined });
            return;
        }

        if (
            teamStats.tooltipInfo?.teamId &&
            teamStats.tooltipInfo?.teamId === teamId
        ) {
            return;
        }

        const p = currentTarget?.parentElement?.parentElement?.parentElement;
        const tw = tooltipWidth + 2 * tooltipPadding;
        let left;
        if (p) {
            const maxRight = p.offsetLeft + p.offsetWidth;
            if (
                currentTarget.offsetLeft +
                currentTarget.offsetWidth / 2 +
                tw / 2 >
                maxRight
            ) {
                left = p.offsetWidth - tw;
            }
        }

        if (!left) {
            left =
                currentTarget.offsetLeft +
                currentTarget.offsetWidth / 2 -
                tw / 2;
        }

        if (left < 0) {
            left = 0;
        }

        const info = {
            teamId,
            left,
            top: currentTarget.offsetTop + currentTarget.offsetHeight + 20,
            connectionLeft:
                currentTarget.offsetLeft + currentTarget.offsetWidth / 2 - left,
        };

        dispatch({ type: 'tooltip', payload: info });
    };

    const total = props.teamProducts.reduce((a: number, b: TeamCard) => a + b.count, 0) || 0;

    const cardCount = Math.ceil(props.teamProducts.length / 3);

    const cards = [[], [], []] as JSX.Element[][];
    
    for (let i = 0; i < 3; ++i) {
        for (
            let j = 0;
            j < cardCount && i * cardCount + j < props.teamProducts.length;
            ++j
        ) {
            const t = props.teamProducts[i * cardCount + j];
            const cardClass =
                teamStats.tooltipInfo && teamStats.tooltipInfo?.teamId === t.teamId
                    ? styles.card + ' ' + styles.activeCard
                    : styles.card;

            cards[i].push(
                <button
                    key={t.teamId + j.toString() + i}
                    className={cardClass}
                    onClick={(e) => onTeamClick(t.teamId, e)}
                >
                    <span className={styles.name}>{t.title}</span>
                    <span className={styles.counter}>{t.count}</span>
                    <div className={styles.leader}>{t.leader}</div>
                </button>
            );
        }
    }

    let tooltip;
    let style;

    if (teamStats.tooltipInfo) {
        const tooltipStyle: any = {
            width: tooltipWidth,
            top: teamStats.tooltipInfo.top,
            left: teamStats.tooltipInfo.left,
        };

        let content;
        if (teamStats.loading) {
            content = 'Loading...';
        } else if (teamStats.error) {
            content = teamStats.error;
        } else if (teamStats.tooltipInfo.teamCards) {
            content = <IndicatorsCardGroup cards={teamStats.tooltipInfo.teamCards} />;
        }

        tooltip = <div className={styles.tooltip} style={tooltipStyle}>
            <div className={styles.tooltipTitle}>
                <button
                    onClick={() => dispatch({ type: 'tooltip', payload: undefined })}
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

        style = {
            '--connection-left': teamStats.tooltipInfo.connectionLeft + 'px',
        } as React.CSSProperties;
    }

    return <>
        <StatHeader image='group' title='Teams' />
        <div className={styles.container} style={style}>
            <div className={styles.title}>
                Team products
                <span className={styles.rightSpan}>Total: {total}</span>
            </div>
            <div className={styles.row}>
                {cards.map((c, i) => (
                    <div key={i} className={styles.column}>{c}</div>
                ))}
            </div>
            {tooltip}
        </div>
    </>;
};

export default TeamCardsGroup;
