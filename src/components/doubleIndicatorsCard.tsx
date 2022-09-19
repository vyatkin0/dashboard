import StatHeader from './statHeader';
import styles from './doubleIndicatorsCard.module.css';

interface IndicatorProps {
    type: string;
    count: number;
}

export interface DoubleIndicatorsCardProps {
    title: string;
    head: {
        title: string;
        image: string;
    };
    indicators: [IndicatorProps, IndicatorProps];
}

const DoubleIndicatorsCard = (props: DoubleIndicatorsCardProps): JSX.Element => {
    const colors = ['#F4B77E', '#95A6DD'];
    const total = props.indicators.reduce((a: number, b: IndicatorProps) => a + b.count, 0) || 0;
    const width = total ? props.indicators.map((d: IndicatorProps) => Math.round((100 * d.count) / total) + '%') : ['50%', '50%'];

    return <>
        <StatHeader {...props.head} rightText={`Total: ${total}`} />
        <div className={styles.сontainer}>
            <div>{props.title}</div>
            <div className={styles.indicators}>
                <div style={{ width: width[0] }}>
                    <div>
                        <span style={{ paddingLeft: 5 }}>{props.indicators[0].type}</span>
                        <span className={styles.counter} style={{ paddingRight: 5 }}>
                            {props.indicators[0].count}
                        </span>
                    </div>
                    <div
                        className={styles.line}
                        style={{ backgroundColor: colors[0] }}
                    ></div>
                </div>
                <div style={{ width: width[1] }}>
                    <div>
                        <span style={{ paddingLeft: 5 }}>
                            {props.indicators[1].count}
                        </span>
                        <span className={styles.counter}>
                            {props.indicators[1].type}
                        </span>
                    </div>
                    <div
                        className={styles.line}
                        style={{ backgroundColor: colors[1] }}
                    ></div>
                </div>
            </div>
        </div>
    </>;
};

export default DoubleIndicatorsCard;
