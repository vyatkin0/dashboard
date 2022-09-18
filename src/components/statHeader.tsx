import styles from './statHeader.module.css';

interface StatHeaderProps {
    title?: string;
    rightText?: string;
    image?: string;
    rightColor?: string;
}

const StatHeader = (props: StatHeaderProps): JSX.Element => <div className={styles.container}>
    <span>
        <span className={styles.image + ' material-symbols-outlined'}>
            {props.image}
        </span>
        {props.title}
    </span>
    {props.title && props.rightText && <span style={{ color: props.rightColor || '#2E75F5' }}
        className={styles.rightSpan}>
        {props.rightText}
    </span>}
</div>;

export default StatHeader;