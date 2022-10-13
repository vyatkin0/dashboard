import StatHeader from './statHeader';
import styles from './newCardsGroup.module.css';
import NewCard, { NewCardProps } from './newCard';
import Tooltip from './tooltip';
import tooltips from '../tooltips.json';

export interface NewCardsGroupProps {
    days: number;
    cards: NewCardProps[];
}

const {new_solutions, new_products, new_components} = (tooltips as { [key: string]: string; });
const titles = [new_solutions, new_products, new_components];

const NewCardsGroup = (props: NewCardsGroupProps): JSX.Element => <>
    <StatHeader image='home' title='Software' rightColor='var(--color-grey)' rightText={`for last ${props.days} days`} />
    <div className={styles.container}>
        {props.cards.map((card: NewCardProps, n: number) =><Tooltip title={titles[n]} key={n}><NewCard {...card}></NewCard></Tooltip>)}
    </div>
</>;

export default NewCardsGroup;