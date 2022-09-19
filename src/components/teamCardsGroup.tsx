import React from 'react';
import StatHeader from './statHeader';
import styles from './teamCardsGroup.module.css';
import TeamCardsTooltip, { tooltipWidth } from './teamCardsTooltip';

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
    connectionLeft: number;
    top: number;
    left: number;
}

const TeamCardsGroup = (props: TeamCardsGroupProps): JSX.Element => {
    const [tooltipInfo, setTooltipInfo] = React.useState(undefined as TooltipInfo | undefined);

    const onClose = React.useCallback(() => setTooltipInfo(undefined), []);

    const onTeamClick = (
        teamId: number,
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const currentTarget = e?.currentTarget as HTMLElement;
        const p = currentTarget?.parentElement?.parentElement?.parentElement;
        if (!p) {
            setTooltipInfo(undefined);
            return;
        }

        if (tooltipInfo?.teamId && tooltipInfo.teamId === teamId) {
            return;
        }

        const tw = tooltipWidth + 2 * tooltipPadding;
        let left;
        const maxRight = p.offsetLeft + p.offsetWidth;
        if (currentTarget.offsetLeft + currentTarget.offsetWidth / 2 + tw / 2 > maxRight) {
            left = p.offsetWidth - tw;
        }

        if (!left) {
            left = currentTarget.offsetLeft + currentTarget.offsetWidth / 2 - tw / 2;
        }

        if (left < 0) {
            left = 0;
        }

        setTooltipInfo({
            teamId,
            left,
            top: currentTarget.offsetTop + currentTarget.offsetHeight + 20,
            connectionLeft:
                currentTarget.offsetLeft + currentTarget.offsetWidth / 2 - left,
        });
    };

    const cards = React.useMemo(() => {
        const cardCount = Math.ceil(props.teamProducts.length / 3);

        const c = [[], [], []] as JSX.Element[][];

        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < cardCount && i * cardCount + j < props.teamProducts.length; ++j) {
                const t = props.teamProducts[i * cardCount + j];
                const cardClass = tooltipInfo && tooltipInfo.teamId === t.teamId
                    ? styles.card + ' ' + styles.activeCard
                    : styles.card;

                c[i].push(
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

        return c;
    }, [tooltipInfo, onTeamClick, props.teamProducts]);

    const style = tooltipInfo ? { '--connection-left': tooltipInfo.connectionLeft + 'px' } as React.CSSProperties : undefined;

    const total = props.teamProducts.reduce((a: number, b: TeamCard) => a + b.count, 0) || 0;

    return <>
        <StatHeader image='group' title='Teams' />
        <div className={styles.container} style={style}>
            <div className={styles.title}>
                Team products
                <span className={styles.rightSpan}>Total: {total}</span>
            </div>
            <div className={styles.row}>
                {cards.map((c, i) => <div key={i} className={styles.column}>{c}</div>)}
            </div>
            {tooltipInfo && <TeamCardsTooltip onClose={onClose} {...tooltipInfo} />}
        </div>
    </>;
};

export default TeamCardsGroup;
