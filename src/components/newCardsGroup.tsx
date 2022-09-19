import StatHeader from './statHeader';
import styles from './newCardsGroup.module.css';
import NewCard, { NewCardProps } from './newCard';

export interface NewCardsGroupProps {
    days: number;
    cards: NewCardProps[];
}

const NewCardsGroup = (props: NewCardsGroupProps): JSX.Element => <>
    <StatHeader image='home' title='Software' rightColor='#BDBDBD' rightText={`for last ${props.days} days`} />
    <div className={styles.container}>
        {props.cards.map((card: NewCardProps, n: number) => <NewCard key={n} {...card} />)}
    </div>
</>;

export default NewCardsGroup;