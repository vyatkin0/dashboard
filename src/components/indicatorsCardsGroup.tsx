import StatHeader from './statHeader';
import styles from './indicatorsCardsGroup.module.css';
import IndicatorsCard, { IndicatorsCardProps } from './indicatorsCard';

export interface IndicatorsCardsProps {
    title?: string;
    image?: string;
    info: IndicatorsCardProps;
}

interface IndicatorsCardsGroupProps {
    cards: IndicatorsCardsProps[];
}

const IndicatorsCardsGroup = (props: IndicatorsCardsGroupProps): JSX.Element => <div className={styles.container}>
    {props.cards?.map((card: IndicatorsCardsProps, n: number) => {
        const total = card.info.indicators?.reduce((a: number, b) => a + b.count, 0);
        return <div key={n} className={styles.card}>
            <StatHeader image={card.image} title={card.title} rightText={`Total: ${total || ''}`} />
            <IndicatorsCard {...card.info} />
        </div>;
    })}
</div>;

export default IndicatorsCardsGroup;