import Indicator from './indicator';
import styles from './indicatorsCard.module.css';

export interface IndicatorProps {
    type: string;
    count: number;
}

export interface IndicatorsCardProps {
    title: string;
    indicators?: IndicatorProps[];
}

const IndicatorsCard = (props: IndicatorsCardProps): JSX.Element => {
    const colors = ['#95A6DD', '#F3C96B', '#84BFDB', '#D38BC3', '#F4B77E'];
    const total = props.indicators?.reduce((a: number, b: IndicatorProps) => a + b.count, 0) || 0;

    return <div className={styles.container}>
        <div>{props.title}</div>
        {props.indicators?.map((i: IndicatorProps, n: number) => <Indicator key={n} background={colors[n % colors.length]} total={total} {...i} />)}
    </div>;
};

export default IndicatorsCard;