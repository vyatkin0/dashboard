import React from 'react';
import DoubleIndicatorsCard, { DoubleIndicatorsCardProps } from './components/doubleIndicatorsCard';
import IndicatorsCardGroup, { IndicatorsCardsProps } from './components/indicatorsCardsGroup';
import NewCardsGroup, { NewCardsGroupProps } from './components/newCardsGroup';
import TeamCardsGroup, { TeamCard } from './components/teamCardsGroup';
import { apiUrl } from './config';

interface AppState {
    loading: boolean,
    error?: string,
    data?: any,
}

interface Stats {
    newcards?: NewCardsGroupProps;
    teamProducts?: TeamCard[];
    solutions?: DoubleIndicatorsCardProps;
    cards?: IndicatorsCardsProps[];
}

type Action = { type: 'loading', payload: boolean }
    | { type: 'loaded', payload: any }
    | { type: 'error', payload: string };

const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'loading':
            return { error: state.error, loading: action.payload };
        case 'loaded':
            return { data: action.payload, loading: false };
        case 'error':
            return { error: action.payload, loading: false };
        default:
            throw new Error();
    }
}

const getStatsInfo = (stats: any): Stats => {
    const newcards: NewCardsGroupProps = {
        days: stats.news.days,
        cards: [
            {
                title: 'Solutions',
                count: stats.news.solutions,
                bg: 0,
            },
            {
                title: 'Products',
                count: stats.news.products,
                bg: 1,
            },
            {
                title: 'Components',
                count: stats.news.components,
                bg: 2,
            },
        ],
    };

    const teamProducts: TeamCard[] = stats.teamProducts;

    const solutions: DoubleIndicatorsCardProps = {
        title: 'Type',
        head: {
            title: 'Solutions',
            image: 'lightbulb',
        },
        indicators: stats.solutions,
    };

    const cards: IndicatorsCardsProps[] = [
        {
            image: 'thumb_up',
            title: 'Products',
            info: {
                title: 'Status',
                indicators: stats.productsByStatus.map((c: any) => ({ name: c.status, count: c.count })),
            }
        },
        {
            info: {
                title: 'Type',
                indicators: stats.productsByType.map((c: any) => ({ name: c.type, count: c.count })),
            }
        },
        {
            image: 'grid_view',
            title: 'Components',
            info: {
                title: 'Status',
                indicators: stats.componentsByStatus.map((c: any) => ({ name: c.status, count: c.count })),
            }
        },
    ];

    return { newcards, teamProducts, solutions, cards };
};

const App = (): JSX.Element => {
    const [stats, dispatch] = React.useReducer(reducer, { loading: false });

    React.useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        dispatch({ type: 'loading', payload: true })
        fetch(apiUrl('stats'), { signal }).then(data => {
            data.json().then(payload => dispatch({ type: 'loaded', payload }));
        })
            .catch(e => dispatch({ type: 'error', payload: e.message }))
            .finally(() => {
                dispatch({ type: 'loading', payload: false });
            });
        return () => {
            controller.abort();
        };
    }, []);

    const { newcards, solutions, teamProducts, cards } = React.useMemo(() => {
        if (!stats.data) {
            return {};
        }
        return getStatsInfo(stats.data);
    }, [stats.data]);

    if (stats.loading) {
        return <p>Loading...</p>;
    }

    if (stats.error) {
        return <p>{stats.error}</p>;
    }

    if (!stats.data) {
        return <p>No data</p>;
    }

    return <>
        {newcards && <NewCardsGroup {...newcards} />}
        {solutions && <DoubleIndicatorsCard {...solutions} />}
        {teamProducts && <TeamCardsGroup teamProducts={teamProducts} />}
        {cards && <IndicatorsCardGroup cards={cards} />}
    </>;
};

export default App;