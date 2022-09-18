import styles from './indicator.module.css';

export interface IdicatorProps {
    name?: string;
    count: number;
    total: number;
    background: string
}

const Indicator = (props: IdicatorProps): JSX.Element => {
    const width = props.total ? Math.round(100 * props.count / props.total) + '%' : '100%';

    return <div className={styles.container}>
        <div><span>{props.name}</span><span className={styles.counter}>{props.count}</span></div>
        <div className={styles.line}><div className={styles.fill} style={{ width, background: props.background }}></div></div>
    </div>;
};

export default Indicator;